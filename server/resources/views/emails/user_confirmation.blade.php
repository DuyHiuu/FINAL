
@component('mail::message')

# Xác nhận tài khoản

{{-- <div style="background-image: url('https://e0.pxfuel.com/wallpapers/906/85/desktop-wallpaper-wide-mouth-singing-cat-pop-cat-pop-cat-cat-memes-cat-profile-popcat.jpg'); 
            background-size: cover; padding-left: 50px; padding-top: 50px;"> --}}

Xin chào {{$user->name}},

Cảm ơn bạn đã đăng ký tài khoản tại Petspa! Vui lòng nhấn vào nút bên dưới để kích hoạt tài khoản của bạn:

@component('mail::button', ['url' => $active])
Kích hoạt
@endcomponent

@endcomponent

