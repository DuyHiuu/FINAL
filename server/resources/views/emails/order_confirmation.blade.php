
@component('mail::message')

# Xác nhận đơn đặt phòng

{{-- <div style="background-image: url('https://e0.pxfuel.com/wallpapers/906/85/desktop-wallpaper-wide-mouth-singing-cat-pop-cat-pop-cat-cat-memes-cat-profile-popcat.jpg'); 
            background-size: cover; padding-left: 50px; padding-top: 50px;"> --}}

Xin chào {{$payment->user->name}},

Cảm ơn bạn đã tin tưởng và đặt phòng tại Petspa. Đây là thông tin đơn đặt phòng của bạn:

<p><strong>Ngày bắt đầu:</strong> {{ \Carbon\Carbon::parse($payment->booking->start_date)->format('d/m/Y') }}</p>
<p><strong>Ngày kết thúc:</strong> {{ \Carbon\Carbon::parse($payment->booking->end_date)->format('d/m/Y') }}</p>
<p><strong>Phòng và dịch vụ(nếu có):</strong></p>
<p><strong>Mô tả phòng: </strong>{{ $payment->booking->room->description }}</p>
<p><strong>Gía phòng: </strong>{{ number_format($payment->booking->room->price, 0, ',', '.') }} VNĐ</p>

@if ($payment->booking->services && $payment->booking->services->isNotEmpty())
@foreach($payment->booking->services as $service)
    Dịch vụ: {{ $service->name }}
    Giá: {{ number_format($service->price, 0, ',', '.') }} VNĐ
@endforeach
@endif

 <p><strong>Tổng tiền:</strong> {{ number_format($payment->total_amount, 0, ',', '.') }} VNĐ</p>
@endcomponent

