<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ReplyContactMail extends Mailable
{
    use Queueable, SerializesModels;

    public $contact;
    public $replyMessage;

    /**
     * Create a new message instance.
     */
    public function __construct($contact, $replyMessage)
    {
        $this->contact = $contact;
        $this->replyMessage = $replyMessage;
    }

    /**
     * Build the message.
     */
    public function build()
    {
        return $this->subject('Phản hồi từ đội ngũ hỗ trợ')
            ->view('emails.reply_contact')
            ->with([
                'contact' => $this->contact,
                'replyMessage' => $this->replyMessage,
            ]);
    }
}
