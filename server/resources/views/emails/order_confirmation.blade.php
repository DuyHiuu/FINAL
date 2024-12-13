<!DOCTYPE html>
<html lang="vi">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Xác nhận thanh toán</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }

        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .email-header {
            text-align: center;
            margin-bottom: 20px;
        }

        .email-header h1 {
            color: #4CAF50;
        }

        .email-body {
            font-size: 16px;
            line-height: 1.6;
            color: #333333;
        }

        .email-body p {
            margin-bottom: 10px;
        }

        .email-footer {
            text-align: center;
            margin-top: 20px;
            padding: 10px;
            background-color: #f9f9f9;
            border-top: 1px solid #ddd;
        }

        .qr-code {
            display: block;
            margin: 20px auto;
            max-width: 200px;
        }

        .button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #4CAF50;
            color: #ffffff;
            text-decoration: none;
            border-radius: 5px;
            text-align: center;
            margin-top: 20px;
        }
    </style>
</head>

<body>

    <div class="email-container">
        <div class="email-header">
            <h1>Xác nhận đặt phòng thành công</h1>
        </div>

        <div class="email-body">
            <p>Chào {{ $payment->user->name }},</p>
            <p>Chúng tôi đã xác nhận thông tin đặt phòng của bạn. Dưới đây là một số lưu ý:</p>
            <p><strong>Ngày check-in :</strong>{{$payment->booking->start_date}}</p>
            <p><strong>Ngày check-out :</strong>{{$payment->booking->end_date}}</p>
            <p><strong>Giờ check-in :</strong>{{$payment->booking->start_hour}}</p>
            <p><strong>Giờ check-out :</strong>{{$payment->booking->end_hour}}</p>
            <p><strong>* Lưu ý:</strong></p>
            <p> Nếu bạn đến trễ sau check-in 3 tiếng thì chúng tôi sẽ tự động hủy phòng của bạn và không hoàn trả tiền.</p>
            <p> Nếu bạn đến trễ sau giờ check-out 3 tiếng thì chúng tôi sẽ phụ thu thêm 500.000 VNĐ.</p>

            <p><strong>Tổng số tiền:</strong> {{ $payment->total_amount }} VND</p>

            <p><strong>Chú ý:</strong> Vui lòng kiểm tra kĩ thông tin dưới QR dưới đây, QR này để check-in khi đến
                PetSpa.</p>

            <img class="qr-code" src="{{ $qrCodeUrl }}" alt="QR Code">
        </div>

        <div class="email-footer">
            <p>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!</p>
            <p>Trân trọng,</p>
            <p>Đội ngũ hỗ trợ khách hàng</p>
        </div>
    </div>

</body>

</html>
