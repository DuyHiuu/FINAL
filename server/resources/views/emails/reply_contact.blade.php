@component('mail::message')

# Xác nhận yêu cầu hỗ trợ của bạn

<style>
    body {
        font-family: Arial, sans-serif;
        line-height: 1.6;
        color: #333;
    }
    .banner {
        text-align: center;
        margin-bottom: 20px;
    }
    .banner img {
        max-width: 100%;
        height: auto;
    }
    .content {
        padding: 20px;
        background-color: #f9f9f9;
        border: 1px solid #ddd;
        border-radius: 5px;
    }
    .footer {
        text-align: center;
        margin-top: 20px;
        font-size: 12px;
        color: #777;
    }
</style>

<div class="banner">
    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXwiOlo6US3qe6hXoaHSs9jSvpaPO_j_KPnQ&s" alt="Petspa">
</div>

<div class="container">
    <p>Chào {{ $contact->name }},</p>
    <p>Cảm ơn bạn đã liên hệ với chúng tôi!</p>
    <p>Thông tin liên hệ của bạn:</p>
    <ul>
        <li><strong>Email:</strong> {{ $contact->email }}</li>
        <li><strong>Số điện thoại:</strong> {{ $contact->phone_number }}</li>
        <li><strong>Nội dung:</strong> {{ $contact->message }}</li>
    </ul>
    <p>Đây là phản hồi từ đội ngũ hỗ trợ Petspa:</p>
    <p>{{ $replyMessage }}</p>
    <p>Trân trọng,</p>
    <p>Đội ngũ hỗ trợ</p>
</div>

<div class="footer">
    <p>© 2024 PetSpa. Mọi quyền được bảo lưu.</p>
</div>