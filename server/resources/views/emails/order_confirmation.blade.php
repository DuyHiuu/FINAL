<!DOCTYPE html>
<html lang="vi">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Xác Nhận Đơn Hàng</title>
</head>

<body>
    <h1>Cảm ơn bạn đã đặt phòng!</h1>
    <p>Chúng tôi xin xác nhận rằng đơn đặt phòng của bạn đã được tạo thành công.</p>
    <p><strong>Booking ID:</strong> {{ $booking->id }}</p>
    <p><strong>Ngày bắt đầu:</strong> {{ \Carbon\Carbon::parse($booking->start_date)->format('d/m/Y') }}</p>
    <p><strong>Ngày kết thúc:</strong> {{ \Carbon\Carbon::parse($booking->end_date)->format('d/m/Y') }}</p>
    <p><strong>Phòng:</strong> {{ $booking->room->name }}</p>
    <p><strong>Tổng tiền:</strong> {{ number_format($booking->total_amount, 0, ',', '.') }} VNĐ</p>

    <p>Chúng tôi hy vọng bạn sẽ có một kỳ nghỉ tuyệt vời!</p>
</body>

</html>
