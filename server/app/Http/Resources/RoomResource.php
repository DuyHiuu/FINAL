<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RoomResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            "id"=>$this->id,
            "price"=>$this->price,
            "description"=>$this->description,
            "statusroom"=>$this->statusroom,
            "size_id"=>[
                'size_id'=>$this->size_id,
                'name'=>$this->name
            ],
            "roomImg_id"=>[
                'roomImg_id'=>$this->roomImg_id,
                'image'=>$this->image
            ]
        ];
    }
}
