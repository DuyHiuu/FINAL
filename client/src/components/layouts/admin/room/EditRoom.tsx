import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Input, Button, Select, Upload, message, InputNumber } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import useFetchSize from '../../../../api/useFetchSize';

const { TextArea } = Input;

const EditRoom = () => {
    const showUrl = "http://localhost:8000/api/rooms";
    const { id } = useParams();
    const [form] = Form.useForm();
    const [img_thumbnail, setImg_thumbnail] = useState<File | null>(null);

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
                    setImg_thumbnail(room.img_thumbnail); // Set the initial image thumbnail
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
            img_thumbnail: img_thumbnail,
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

    const handleImageChange = (info) => {
        if (info.file.status === 'done') {
            setImg_thumbnail(info.file.response.url); // Assuming your backend returns the image URL
            message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
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

            <Form.Item
                label="Trạng Thái"
                name="statusroom"
                rules={[{ required: true, message: 'Vui lòng nhập trạng thái phòng!' }]}
            >
                <Input
                    placeholder="Nhập trạng thái phòng"
                />
            </Form.Item>

            <Form.Item label="Hình Ảnh Chính">
                {img_thumbnail && <img src={img_thumbnail} alt="Room Thumbnail" className="h-32 mb-2" />}
                <Upload
                    name="img_thumbnail"
                    action="http://localhost:8000/api/upload"  // URL for uploading image
                    showUploadList={false}
                    onChange={handleImageChange}
                    accept="image/*"
                    maxCount={1}
                >
                    <Button icon={<UploadOutlined />}>Chọn Hình Ảnh</Button>
                </Upload>
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
