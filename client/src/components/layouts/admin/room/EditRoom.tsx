import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Input, Button, Select, message, InputNumber } from 'antd';
import useFetchSize from '../../../../api/useFetchSize';

const { TextArea } = Input;

const EditRoom = () => {
    const showUrl = "http://localhost:8000/api/rooms";
    const { id } = useParams();
    const [form] = Form.useForm();
    const [imgThumbnailBase64, setImgThumbnailBase64] = useState(null);
    const navigate = useNavigate();
    const { sizes } = useFetchSize();

    useEffect(() => {
        const fetchRoom = async () => {
            try {
                const res = await fetch(`${showUrl}/${id}`);
                if (res.ok) {
                    const room = await res.json();
                    form.setFieldsValue({
                        price: room.price,
                        size_id: room.size_id,
                        description: room.description,
                        statusroom: room.statusroom,
                    });
                    setImgThumbnailBase64(room.img_thumbnail); // Set initial image URL/base64
                } else {
                    message.error('Không thể lấy thông tin phòng');
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchRoom();
    }, [id, form]);

    const handleSubmit = async (values) => {
        const updateRoom = {
            price: values.price,
            size_id: values.size_id,
            description: values.description,
            statusroom: values.statusroom,
            img_thumbnail: imgThumbnailBase64, // Send base64 or existing URL
        };

        try {
            const response = await fetch(`${showUrl}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateRoom),
            });

            if (response.ok) {
                message.success('Phòng đã sửa thành công');
                navigate('/admin');
            } else {
                message.error('Lỗi khi sửa phòng');
            }
        } catch (error) {
            message.error('Lỗi kết nối API');
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImgThumbnailBase64(reader.result); // Set base64 string of the image
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <Form
            form={form}
            onFinish={handleSubmit}
            className="max-w-lg mx-auto p-6 border border-gray-300 rounded shadow-md"
        >
            <h2 className="text-2xl font-bold mb-4">Sửa Thông Tin Phòng</h2>

            <Form.Item
                label="Giá (VND)"
                name="price"
                rules={[{ required: true, message: 'Vui lòng nhập giá phòng!' }]}
            >
                <InputNumber
                    style={{ width: '100%' }}
                    placeholder="Nhập giá phòng"
                    min={0}
                />
            </Form.Item>

            <Form.Item
                label="Size"
                name="size_id"
                rules={[{ required: true, message: 'Vui lòng chọn kích thước phòng!' }]}
            >
                <Select placeholder="Chọn kích thước">
                    {sizes?.map((size) => (
                        <Select.Option key={size.id} value={size.id}>
                            {size.name}
                        </Select.Option>
                    ))}
                </Select>
            </Form.Item>

            <Form.Item
                label="Mô Tả"
                name="description"
                rules={[{ required: true, message: 'Vui lòng nhập mô tả phòng!' }]}
            >
                <TextArea
                    placeholder="Nhập mô tả phòng"
                    autoSize={{ minRows: 3, maxRows: 5 }}
                />
            </Form.Item>

            {/* Trạng Thái */}
            <Form.Item
                label="Trạng Thái"
                name="statusroom"
                rules={[{ required: true, message: 'Vui lòng chọn trạng thái phòng!' }]}
            >
                <Select placeholder="Chọn trạng thái phòng">
                    <Select.Option value="Còn phòng">Còn phòng</Select.Option>
                    <Select.Option value="Hết phòng">Hết phòng</Select.Option>
                </Select>
            </Form.Item>

            <Form.Item label="Hình Ảnh Chính">
                {imgThumbnailBase64 && (
                    <img src={imgThumbnailBase64} alt="Room Thumbnail" className="h-32 mb-2" />
                )}
                <input type="file" accept="image/*" onChange={handleImageChange} />
            </Form.Item>

            <Form.Item>
                <Button
                    type="primary"
                    htmlType="submit"
                    style={{ width: '100%' }}
                >
                    Sửa
                </Button>
            </Form.Item>
        </Form>
    );
};

export default EditRoom;
