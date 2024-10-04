<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BookingResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            "start_date"=>$this->start_date,
            "end_date"=>$this->end_date,
            "totalamount"=>$this->totalamount,
            "room_id"=>$this->room_id,
            "service_id"=>[
                "service_id"=>$this->service_id,
                "name"=>$this->name
            ],
            "voucher_id"=>[
                "voucher_id"=>$this->voucher_id,
                "name"=>$this->name
            ],
        ];
    }
}
