<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PaymentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            "pet_name"=>$this->pet_name,
            "pet_type"=>$this->pet_type,
            "pet_description"=>$this->pet_description,
            "pet_health"=>$this->pet_health,
            "user_name"=>$this->user_name,
            "user_address"=>$this->user_address,
            "user_email"=>$this->user_email,
            "user_phone"=>$this->user_phone,
            "booking_id"=>$this->booking_id,
            "user_id"=>[
                "user_id"=>$this->user_id,
                "name"=>$this->name,
            ],
            "paymethod_id"=>[
                "paymethod_id"=>$this->paymethod_id,
                "name"=>$this->name
            ]
        ];
    }
}
