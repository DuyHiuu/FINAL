<?php

namespace App\Http\Controllers;

use App\Models\Room;
use App\Http\Requests\StoreRoomRequest;
use App\Http\Requests\UpdateRoomRequest;

class RoomController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $room = Room::join('sizes','rooms.size_id','=','sizes.id')
            ->join('room_images','rooms.roomImg_id','=','room_images.id')
            ->select('rooms.*','sizes.name as size_name','sizes.description as size_description','room_images.image',
            'rooms.size_id')
            ->orderBy('rooms.id','desc')
            ->whereNull('rooms.deleted_at')
            ->get();
        $room->makeHidden(['size_id','roomImg_id']);
        return response()->json($room);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRoomRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $room = Room::join('sizes','rooms.size_id','=','sizes.id')
            ->join('room_images','rooms.roomImg_id','=','room_images.id')
            ->select('rooms.*','sizes.name','sizes.description','room_images.image')
            ->where('rooms.id',$id)
            ->whereNull('rooms.deleted_at')
            ->first();

        if ($room) {
            return response()->json($room);
        } else {
            return response()->json(['message' => 'Không tồn tại'], 404);
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Room $room)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRoomRequest $request, Room $room)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Room $room)
    {
        //
    }
}
