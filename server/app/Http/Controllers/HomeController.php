<?php

namespace App\Http\Controllers;

use App\Models\Blog;
use App\Models\Room;
use Illuminate\Http\Request;

class HomeController extends Controller
{
    public function room_home()
    {
        $room = Room::join('sizes','rooms.size_id','=','sizes.id')

            ->select('rooms.*','sizes.name as size_name','sizes.description as size_description','sizes.quantity as quantity',
                'rooms.size_id')
            ->whereNull('rooms.deleted_at')
            ->take(5)
            ->get();
        $room->makeHidden(['size_id']);
        return response()->json($room);
    }
    public function blog_home()
    {
        $blog = Blog::join('users','blogs.user_id','=','users.id')
            ->select('blogs.*','users.name')
            ->whereNull('blogs.deleted_at')
            ->take(3)
            ->get();
        $blog->makeHidden('user_id');

        return response()->json($blog);
    }
}
