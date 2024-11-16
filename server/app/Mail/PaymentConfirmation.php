<?php

namespace App\Mail;

use App\Models\Payment;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class PaymentConfirmation extends Mailable
{
    use Queueable, SerializesModels;

    protected $payment;
    protected $user;
    protected $additionalData;

    // Constructor nhận 3 đối số
    public function __construct(Payment $payment, User $user, $additionalData)
    {
        $this->payment = $payment;
        $this->user = $user;
        $this->additionalData = $additionalData;
    }

    public function build()
    {
        return $this->view('emails.payment_confirmation')
            ->with([
                'payment' => $this->payment,
                'user' => $this->user,
                'additionalData' => $this->additionalData,
            ]);
    }
}
