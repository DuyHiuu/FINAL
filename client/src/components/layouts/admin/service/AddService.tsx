import { Button, Form, Input, Upload } from 'antd';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusOutlined } from '@ant-design/icons';
import TextArea from 'antd/es/input/TextArea';

const AddService = () => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const [message, setMessage] = useState('');
    const [previewImage, setPreviewImage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const storeUrl = "http://localhost:8000/api/services";

    const beforeUpload = (file) => {
        const isImage = file.type.startsWith('image/');
        const isLt5M = file.size / 1024 / 1024 < 5;

        if (!isImage) {
            message.error('Chỉ cho phép tải lên tệp hình ảnh!');
        }
        if (!isLt5M) {
            message.error('Ảnh không được vượt quá 5MB!');
        }
        return isImage && isLt5M;
    };

    const handleSubmit = async (e) => {
        setIsLoading(true);

        const formData = new FormData();
        formData.append('price', price);
        formData.append('name', name);
        formData.append('description', description);
        formData.append('image', image);

        try {
            const response = await fetch(storeUrl, {
                method: 'POST',
                body: formData,
            });

            setIsLoading(false);

            if (response.ok) {
                const data = await response.json();
                console.log('Dịch vụ đã thêm thành công:', data);
                setMessage("Dịch vụ đã được thêm thành công!");
                setTimeout(() => {
                    navigate('/admin/services');
                }, 2000);
            } else {
                const errorData = await response.json();
                console.error('Lỗi khi thêm dịch vụ:', errorData.message);
                setMessage(`Thêm dịch vụ thất bại: ${errorData.message}`);
            }
        } catch (error) {
            setIsLoading(false);
            console.error('Lỗi kết nối API:', error);
            setMessage("Đã xảy ra lỗi khi thêm dịch vụ.");
        }
    };

    return (
        <div className="container mx-auto p-4">
            <Form
                onFinish={handleSubmit}
                className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto"
            >
                <h2 className="text-2xl font-bold mb-4 text-center">Thêm Dịch Vụ Mới</h2>

                {message && (
                    <div className={`mb-4 p-2 rounded ${message.includes("thất bại") ? "bg-red-200 text-red-700" : "bg-green-200 text-green-700"}`}>
                        {message}
                    </div>
                )}

                <Form.Item
                    label="Tên"
                    name="name"
                    rules={[{ required: true, message: 'Vui lòng nhập tên dịch vụ!' }]}
                >
                    <Input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full"
                    />
                </Form.Item>

                {previewImage && (
                    <img
                        src={previewImage}
                        alt="Preview"
                        style={{ marginBottom: '16px', width: '40%', maxHeight: '300px', objectFit: 'cover' }}
                    />
                )}

                <Form.Item
                    label="Hình Ảnh Chính"
                    name="image"
                    rules={[{ required: true, message: 'Vui lòng tải lên hình ảnh!' }]}>
                    <Upload
                        accept="image/*"
                        showUploadList={false}
                        beforeUpload={beforeUpload}
                        customRequest={({ file, onSuccess }) => {
                            setImage(file);
                            setPreviewImage(URL.createObjectURL(file)); // Tạo URL xem trước
                            onSuccess();
                        }}
                    >
                        <Button icon={<PlusOutlined />}>Tải lên hình ảnh</Button>
                    </Upload>
                </Form.Item>

                <Form.Item
                    label="Mô tả"
                    name="description"
                    rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
                >
                    <TextArea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full"
                    />
                </Form.Item>

                <Form.Item
                    label="Giá"
                    name="price"
                    rules={[{ required: true, message: 'Vui lòng nhập giá!' },
                    {
                        validator: (_, value) => {
                            if (!value || value >= 1) {
                                return Promise.resolve();
                            }
                            return Promise.reject(new Error('Giá không nhỏ hơn 1!'));
                        },
                    },
                    ]}
                >
                    <Input
                        type='number'
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="w-full"
                    />
                </Form.Item>

                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        block
                        loading={isLoading}
                        className={`w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition duration-200 ${isLoading ? 'bg-gray-400' : ''}`}
                    >
                        {isLoading ? "Đang thêm..." : "Thêm Dịch Vụ"}
                    </Button>
                </Form.Item>

            </Form>
        </div>
    );
};

export default AddService;