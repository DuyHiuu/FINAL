<?php

namespace App\Mail;

use App\Models\Payment;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class OrderConfirmation extends Mailable
{
    use Queueable, SerializesModels;

    public $payment;
    public $totalAmount;
    public $discount;

    /**
     * Create a new message instance.
     *
     * @param  \App\Models\Payment  $payment
     * @param  float  $totalAmount
     * @param  float  $discount
     * @return void
     */
    public function __construct(Payment $payment, $totalAmount, $discount)
    {
        $this->payment = $payment;
        $this->totalAmount = $totalAmount;
        $this->discount = $discount;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->view('emails.order_confirmation')
            ->subject('Order Confirmation')
            ->with([
                'payment' => $this->payment,
                'totalAmount' => $this->totalAmount,
                'discount' => $this->discount,
            ]);
    }
}
