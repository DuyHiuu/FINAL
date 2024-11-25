<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Room;
use App\Models\Service;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StatisticalController extends Controller
{
    //thống kê doanh thu năm(tháng),tháng(ngày)
    public function total_revenue(Request $request)
    {
        $data = $request->all();
        $currentYear = Carbon::now()->year;
        $currentMonth = Carbon::now()->month;

        if($data['timeline'] == 'day'){
            $start = Carbon::createFromFormat('d-m-Y',$data['start'])->format('Y-m-d');
            $end = Carbon::createFromFormat('d-m-Y',$data['end'])->format('Y-m-d');

            //start> hien tai
            if(Carbon::parse($start)->greaterThan(now())){
                return response()->json(['error'=>'Không thể xuất doanh thu của ngày tương lai.']);
            }
        }
        else{
            $start =now();
            $end = now();
        }
        // Kiểm tra nếu năm > hiện tại hoặc tháng > tháng hiện tại
        if (
            ($data['timeline'] == 'year' && $data['year'] > $currentYear) ||
            ($data['timeline'] == 'month' && ($data['year'] > $currentYear || ($data['year'] == $currentYear && $data['month'] > $currentMonth)))
        ) {
            return response()->json(['error' => 'Không thể xuất doanh thu của thời gian trong tương lai.']);
        }
        $total_revenue =[];
//        $endDay = Carbon::createFromFormat('d-m-Y', $data['end'])->endOfDay();
//        $end = $endDay->format("Y-m-d H:i:s");
        $paymentQuery = Payment::where('status_id',2);

        if($data['timeline'] == 'year'){
            $paymentQuery->whereYear("created_at",$data['year']);
        }elseif ($data['timeline'] == 'month'){
            $paymentQuery->whereYear("created_at",$data['year'])->whereMonth("created_at",$data['month']);
        }
        elseif ($data['timeline'] == 'day'){
            $paymentQuery->whereBetween("created_at",[$start,$end]);
        }
        $payments = $paymentQuery->select(
            DB::raw("SUM(total_amount) as total"),
            DB::raw("COUNT(id) as quantity")
        )->first();

        $total_revenue['quantity_payment'] = $payments->quantity;
        $total_revenue['total_money'] = $payments->total ?? 0;

        $roomAndServiceQuery = function ($query) use ($data,$start,$end){
            if($data['timeline'] == 'year'){
                $query->whereYear("payments.created_at",$data['year']);
            }elseif ($data['timeline'] == 'month'){
                $query->whereYear("payments.created_at",$data['year'])->whereMonth("payments.created_at",$data['month']);
            }
            elseif ($data['timeline'] == 'day'){
                $query->whereBetween("payments.created_at",[$start,$end]);

            }
        };

        $roomTotal = Room::leftjoin("bookings","bookings.room_id","=","rooms.id")
            ->leftjoin("payments","payments.booking_id","=","bookings.id")
            ->where("payments.status_id",6)
            ->where($roomAndServiceQuery)
            ->select(DB::raw("SUM(price) as total"))
            ->first();

        $serviceTotal = Service::leftjoin("booking_services","booking_services.service_id","=","services.id")
            ->join("bookings","booking_services.booking_id","=","bookings.id")
            ->leftjoin("payments","payments.booking_id","=","bookings.id")
            ->where("payments.status_id",6)
            ->where($roomAndServiceQuery)
            ->whereNull("services.deleted_at")
            ->select(DB::raw("SUM(services.price) as total"))
            ->first();

        if($payments->quantity>0){
            $total_revenue['total_money_room'] = $roomTotal->total;
            $total_revenue['percent_room'] = round($roomTotal->total/$payments->total *100,2);
            $total_revenue['total_money_service'] = $serviceTotal->total;
            $total_revenue['percent_service'] = round($serviceTotal->total/$payments->total *100,2);

        }else{
            $total_revenue += [
              'total_money_room' =>0,
              'percent_room' =>0,
              'total_money_service' =>0,
              'percent_service' =>0,
            ];
        }
        if ($data['timeline'] == 'day') {
            // Kiểm tra nếu start > end
            if (strtotime($start) > strtotime($end)) {
                return response()->json(['error' => 'Ngày bắt đầu phải nhỏ hơn hoặc bằng ngày kết thúc.']);
            }

            $now = now();
            // Nếu ngày end lớn hơn ngày hiện tại, thì lấy ngày hiện tại làm ngày kết thúc
            if (strtotime($end) > strtotime($now)) {
                $end = $now->format('Y-m-d');
            }

            $dailyRevenue = [];

            while ($start<=$end){
                $dailySum = Payment::whereDate('created_at',$start)->where('status_id',6)->sum('total_amount');
                $dailyRevenue[] = ['date' => Carbon::parse($start)->format('d-m-Y'), 'total_money' => $dailySum];
                $start = Carbon::parse($start)->addDay()->format('Y-m-d');
            }
            $total_revenue['dailyRevenue'] = $dailyRevenue;

    }
        elseif ($data['timeline'] == 'year') {
            $selectedMonths = $data['year'] == $currentYear ? range(1, $currentMonth) : range(1, 12);

            $monthlyRevenue = [];

            foreach ($selectedMonths as $month) {
                $firstDay = Carbon::create($data['year'], $month, 1);
                $lastDay = $firstDay->copy()->endOfMonth();

                $sum = Payment::whereBetween('created_at', [$firstDay, $lastDay])->where('status_id', 6)
                    ->select(DB::raw('COALESCE(SUM(total_amount), 0) as total_money'))
                    ->value('total_money');

                $monthlyRevenue[] = ['month' => $month, 'total_amount' => $sum];
            }
            $total_revenue['monthlyRevenue'] = $monthlyRevenue;
    }
        elseif ($data['timeline'] == 'month') {
            $firstDay = Carbon::createFromDate($data['year'], $data['month'], 1);
            $lastDay = now()->endOfMonth();

            if ($firstDay->isCurrentMonth() && now()->isToday()) {
                $lastDay = now(); // Nếu là tháng hiện tại và ngày hiện tại, sẽ đặt $lastDay thành now()
            }

            $dailyRevenue = [];

            while ($firstDay->lte($lastDay) && $firstDay->month == $data['month']) {
                $dailySum = Payment::whereDate('created_at', $firstDay)->where('status_id', 6)->sum('total_amount');
                $dailyRevenue[] = ['date' => $firstDay->format('d-m-Y'), 'total_amount' => $dailySum];
                $firstDay->addDay();
            }

            $total_revenue['dailyRevenue'] = $dailyRevenue;
        }
        if ($total_revenue['total_money'] == 0) {
            $message = "Không có dữ liệu thống kê ";
            if ($data['timeline'] == 'year') {
                $message .= "năm " . $data['year'];
            } elseif ($data['timeline'] == 'month') {
                $message .= "tháng " . $data['month'] . " năm " . $data['year'];
            } elseif ($data['timeline'] == 'day') {
                $message .= "từ " . $data['start'] . " đến " . $data['end'];
            }
            return response()->json(["message" => $message]);
        } else {
            return response()->json($total_revenue);
        }
    }
    //thong ke 3 phong duoc dat nhieu nhat
    public function get_top3_room(Request $request)
    {
        $data=$request->all();
        $year=$data['year'];
        $timeline = $data['timeline'];

        $rooms=Room::leftjoin("bookings","bookings.room_id","=","rooms.id")
            ->leftjoin("payments","payments.booking_id","=","bookings.id")
            ->where("payments.status_id",6);
        if ($timeline == 'month') {
            $month = $data['month'];
            $rooms->whereMonth("payments.created_at", $month)
                ->whereYear("payments.created_at", $year);
        } elseif ($timeline == 'year') {
            $rooms->whereYear("payments.created_at", $year);
        }
        $result = $rooms->select(
            "rooms.description",
            DB::raw("COUNT(payments.id) as total_payments_sold"),
            DB::raw("SUM(rooms.price) as total_revenue")
        )
            ->groupBy("rooms.description")
            ->orderByDesc("total_revenue")
            ->take(3)
            ->get();
        if (count($result) == 0) {
            if ($data['timeline'] == 'year') {
                return response()->json(["message" => "Không có dữ liệu thống kê top 5 phim có doanh thu cao nhất năm " . $data['year']]);
            } else {
                return response()->json(["message" => "Không có dữ liệu thống kê top 5 phim có doanh thu cao nhất tháng " . $data['month'] . " năm " . $data['year']]);
            }
        } else {
            return response()->json($result);
        }
    }
}
