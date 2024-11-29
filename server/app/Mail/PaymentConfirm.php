<?php

namespace App\Mail;

use App\Models\Payment;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class PaymentConfirm extends Mailable
{
    use Queueable, SerializesModels;

    public $payment;
    public $qrCodeUrl;

    /**
     * Create a new message instance.
     */
    public function __construct(Payment $payment, $qrCodeUrl)
    {
        $this->payment = $payment;
        $this->qrCodeUrl = $qrCodeUrl;
    }

    public function build()
    {
        return $this->subject('Xác nhận thanh toán')
            ->markdown('emails.order_confirmation')
            ->with([
                'payment' => $this->payment,
                'qrCodeUrl' => $this->qrCodeUrl,
            ]);
    }
}
