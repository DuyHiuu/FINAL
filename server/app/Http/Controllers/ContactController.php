<?php

namespace App\Http\Controllers;

use App\Mail\ReplyContactMail;
use App\Models\Contact;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;

class ContactController extends Controller
{
    //
    public function index()
    {
        $contacts = Contact::all();

        return response()->json([
            'status' => 'success',
            'contacts' => $contacts
        ]);
    }


    public function store(Request $request)
    {
        $validator = Validator::make(
            $request->all(),
            [
                'name' => 'required',
                'email' => 'required|email',

                'phone_number' => [
                    'required',
                    'regex:/^(0|\+84)(\s|\.)?((3[2-9])|(5[689])|(7[06-9])|(8[1-689])|(9[0-46-9]))(\d)(\s|\.)?(\d{3})(\s|\.)?(\d{3})$/',
                ],
                'message' => 'required'

            ],
            [
                'name.required' => "Tên không được để trống",
                'email.required' => "Email không được để trống",
                'email.email' => "Email không đúng định dạng",
                'phone_number.required' => "Số điện thoại không được để trống",
                'phone_number.regex' => "Số điện thoại không đúng định dạng",
                'message.required' => "Tin nhắn không được để trống",
            ]
        );
        if ($validator->fails()) {
            return response()->json($validator->messages());
        } else {
            $data = $request->all();
            $contact = Contact::create($data);

            $replyMessage = "Cảm ơn bạn, {$contact->name}, đã liên hệ với chúng tôi! 
            Chúng tôi đã nhận được yêu cầu của bạn và sẽ phản hồi trong thời gian sớm nhất.";
            // Tu dong gui mail khi nhap noi dung lien he
            Mail::to($contact->email)->send(new ReplyContactMail($contact, $replyMessage));
            return response()->json([
                'message' => 'Liên hệ của bạn đã được gửi đi và email phản hồi đã được gửi!',
                'contact' => $contact,
            ], 200);
        }
    }

    public function show(string $id)
    {
        $contact = Contact::find($id);
        if ($contact) {
            return response()->json($contact, 200);
        } else {
            return response()->json(['message' => 'Không tồn tại'], 401);
        }
    }
}
