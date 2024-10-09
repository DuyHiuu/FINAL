import React, { useEffect, useState } from 'react';
import useFetchSize from '../../../../api/useFetchSize';
import { useNavigate, useParams } from 'react-router-dom';

const EditRoom = () => {

    const showUrl = "http://localhost:8000/api/rooms";
    const { id } = useParams();
    const [size_id, setSize_id] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [statusroom, setStatusRoom] = useState('');
    const [img_thumbnail, setImg_thumbnail] = useState<File | null>(null);

    const navigate = useNavigate();
    const { sizes } = useFetchSize();

    useEffect(() => {
        const fetchRoom = async () => {
            try {
                const res = await fetch(`${showUrl}/${id}`);
                if (res.ok) {
                    const room = await res.json();
                    setSize_id(room.size_id);
                    setPrice(room.price);
                    setDescription(room.description);
                    setStatusRoom(room.statusroom);
                    setImg_thumbnail(room.img_thumbnail);
                } else {
                    console.error('Không thể lấy thông tin phòng');
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchRoom();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const updateRoom = {
            price:  price,
            size_id:  size_id,
            description:  description,
            statusroom:  statusroom,
            img_thumbnail:  img_thumbnail,
        };

        // if(img_thumbnail) {
        //     updateRoom.append('img_thumbnail',img_thumbnail);
        // }
       


        try {
            const response = await fetch(`${showUrl}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateRoom),
            });

            if (response.ok) {
                console.log('Phòng đã sửa thành công:');
                navigate('/admin');
            } else {
                console.error('Lỗi khi sửa phòng:', response.statusText);
            }
        } catch (error) {
            console.error('Lỗi kết nối API:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-6 border border-gray-300 rounded shadow-md">
            <h2 className="text-2xl font-bold mb-4">Sửa Thông Tin Phòng</h2>

            <div className="mb-4">
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">Giá:</label>
                <input
                    type="number"
                    id="price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-blue-500"
                />
            </div>

            <div className="mb-4">
                <label htmlFor="size_id" className="block text-sm font-medium text-gray-700">Size:</label>
                <select
                    id="size_id"
                    value={size_id}
                    onChange={(e) => setSize_id(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-blue-500"
                >
                    <option value="">Chọn kích thước</option>
                    {sizes?.map((size) => (
                        <option key={size.id} value={size.id}>
                            {size.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Mô Tả:</label>
                <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-blue-500"
                />
            </div>

            <div className="mb-4">
                <label htmlFor="statusroom" className="block text-sm font-medium text-gray-700">Trạng thái:</label>
                <input
                    type="text"
                    id="statusroom"
                    value={statusroom}
                    onChange={(e) => setStatusRoom(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-blue-500"
                />
            </div>

            <div className="mb-4">
                <label htmlFor="img_thumbnail" className="block text-sm font-medium text-gray-700">Hình Ảnh Chính:</label>
                <img src={img_thumbnail} alt="" className='h-32' />
                <input
                    type="file"
                    id="img_thumbnail"
                    onChange={(e) => setImg_thumbnail(e.target.files ? e.target.files[0] : null)}
                    accept="img_thumbnail/*"
                    className="mt-1 block w-full text-gray-700 border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-blue-500"
                />
            </div>

            <button
                type="submit"
                className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition duration-200"
            >
                Sửa
            </button>
        </form>
    );
};

export default EditRoom;
