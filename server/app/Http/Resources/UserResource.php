<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
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
            "name"=>$this->name,
            "email"=>$this->email,
            "phone"=>$this->phone,
            "password"=>$this->password,
            "role"=>[
                'role_id'=>$this->role_id,
                'role_name'=>$this->role->role_name
            ]


        ];
    }
}