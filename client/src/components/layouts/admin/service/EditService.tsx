import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Input, Button, Upload, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const EditService = () => {

    const showUrl = "http://localhost:8000/api/services";
    const { id } = useParams();
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [form] = Form.useForm();

    const navigate = useNavigate();

    useEffect(() => {
        const fetchService = async () => {
            try {
                const res = await fetch(`${showUrl}/${id}`);
                if (res.ok) {
                    const service = await res.json();
                    form.setFieldsValue({
                        name: service.name,
                        price: service.price,
                        description: service.description,
                    });
                    setImage(service.image);
                } else {
                    console.error('Không thể lấy thông tin phòng');
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchService();
    }, [id, form]);

    const handleSubmit = async (values) => {
        setIsLoading(true);

        const updateService = {
            price: values.price,
            name: values.name,
            description: values.description,
            image: image,
        };
        console.log(updateService);
        

        try {
            const response = await fetch(`${showUrl}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateService),
            });
            setIsLoading(false);

            if (response.ok) {
                console.log('Dịch vụ đã sửa thành công:');
                navigate('/admin/services');
            } else {
                console.error('Lỗi khi sửa dịch vụ:', response.statusText);
            }
        } catch (error) {
            setIsLoading(false);
            console.error('Lỗi kết nối API:', error);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
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
            <h2 className="text-2xl font-bold mb-4 text-center">Sửa Dịch Vụ</h2>

            {/* Tên dịch vụ */}
            <Form.Item
                label="Tên"
                name="name"
                rules={[{ required: true, message: 'Vui lòng nhập tên dịch vụ!' }]}
            >
                <Input
                    onChange={(e) => setName(e.target.value)}
                    className="w-full"
                />
            </Form.Item>

            {/* Hình ảnh */}
            <Form.Item label="Hình Ảnh Chính">
                {image && (
                    <img src={image} alt="Image" className="h-32 mb-2" />
                )}
                <input type="file" accept="image/*" onChange={handleImageChange} />
            </Form.Item>

            {/* Mô tả */}
            <Form.Item
                label="Mô Tả"
                name="description"
                rules={[{ required: true, message: 'Vui lòng nhập mô tả dịch vụ!' }]}
            >
                <Input.TextArea
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full"
                    rows={4}
                />
            </Form.Item>

            {/* Giá */}
            <Form.Item
                label="Giá (VND)"
                name="price"
                rules={[
                    { required: true, message: 'Vui lòng nhập giá!' },
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
                    type="number"
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full"
                />
            </Form.Item>

            {/* Nút submit */}
            <Form.Item>
                <Button
                    type="primary"
                    htmlType="submit"
                    block
                    loading={isLoading}
                    className={`w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition duration-200 ${isLoading ? 'bg-gray-400' : ''}`}
                >
                    {isLoading ? 'Đang sửa...' : 'Sửa Dịch Vụ'}
                </Button>
            </Form.Item>
        </Form>
    );
};

export default EditService;