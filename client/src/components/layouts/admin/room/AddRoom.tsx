import React, { useState } from 'react';
import useFetchSize from '../../../../api/useFetchSize';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Select, Upload, message } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';

const { Option } = Select;

const AddRoom = () => {
    const [sizeId, setSizeId] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [statusRoom, setStatusRoom] = useState('Còn phòng'); // Trạng thái mặc định là "Còn phòng"
    const [imgThumbnail, setImgThumbnail] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const storeUrl = "http://localhost:8000/api/rooms";
    const { sizes } = useFetchSize();

    // Kiểm tra dung lượng tệp ảnh
    const beforeUpload = (file) => {
        const isImage = file.type.startsWith('image/');
        const isLt2M = file.size / 1024 / 1024 < 5; // Cho phép ảnh lớn hơn 2MB, nhưng không quá 5MB

        if (!isImage) {
            message.error('Chỉ cho phép tải lên tệp hình ảnh!');
        }
        if (!isLt2M) {
            message.error('Ảnh không được vượt quá 5MB!');
        }
        return isImage && isLt2M;
    };

    const handleSubmit = async (values) => {
        setIsLoading(true); // Bắt đầu trạng thái loading

        const formData = new FormData();
        formData.append('price', values.price);
        formData.append('size_id', values.sizeId);
        formData.append('description', values.description);
        formData.append('statusroom', values.statusRoom);
        formData.append('img_thumbnail', imgThumbnail);

        try {
            const response = await fetch(storeUrl, {
                method: 'POST',
                body: formData,
            });

            setIsLoading(false); // Kết thúc trạng thái loading

            if (response.ok) {
                const data = await response.json();
                console.log('Phòng đã thêm thành công:', data);
                message.success("Phòng đã được thêm thành công!");
                setTimeout(() => {
                    navigate('/admin'); // Chuyển hướng sau 2 giây
                }, 2000);
            } else {
                const errorData = await response.json();
                console.error('Lỗi khi thêm phòng:', errorData.message);
                message.error(`Thêm phòng thất bại: ${errorData.message}`);
            }
        } catch (error) {
            setIsLoading(false); // Kết thúc trạng thái loading
            console.error('Lỗi kết nối API:', error);
            message.error("Đã xảy ra lỗi khi thêm phòng.");
        }
    };

    return (
        <div className="container mx-auto p-4">
            <Form
                onFinish={handleSubmit}
                className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto"
            >
                <h2 className="text-2xl font-bold mb-4 text-center">Thêm Phòng Mới</h2>

                {/* Giá */}
                <Form.Item
                    label="Giá"
                    name="price"
                    rules={[{ required: true, message: 'Vui lòng nhập giá phòng!' }]}
                >
                    <Input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="w-full"
                    />
                </Form.Item>

                {/* Size */}
                <Form.Item
                    label="Size"
                    name="sizeId"
                    rules={[{ required: true, message: 'Vui lòng chọn kích thước!' }]}
                >
                    <Select
                        value={sizeId}
                        onChange={(value) => setSizeId(value)}
                        className="w-full"
                    >
                        <Option value="">Chọn kích thước</Option>
                        {sizes?.map((size) => (
                            <Option key={size.id} value={size.id}>
                                {size.name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                {/* Mô tả */}
                <Form.Item
                    label="Mô Tả"
                    name="description"
                    rules={[{ required: true, message: 'Vui lòng nhập mô tả phòng!' }]}
                >
                    <Input.TextArea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full"
                    />
                </Form.Item>

                {/* Trạng thái */}
                <Form.Item
                    label="Trạng thái"
                    name="statusRoom"
                    rules={[{ required: true, message: 'Vui lòng chọn trạng thái phòng!' }]}
                >
                    <Select
                        value={statusRoom}
                        onChange={(value) => setStatusRoom(value)}
                        className="w-full"
                    >
                        <Option value="Còn phòng">Còn phòng</Option>
                        <Option value="Hết phòng">Hết phòng</Option>
                    </Select>
                </Form.Item>

                {/* Hình ảnh */}
                <Form.Item
                    label="Hình Ảnh Chính"
                    name="imgThumbnail"
                    rules={[{ required: true, message: 'Vui lòng tải lên hình ảnh phòng!' }]}
                >
                    <Upload
                        accept="image/*"
                        showUploadList={false}
                        beforeUpload={beforeUpload} // Kiểm tra ảnh trước khi upload
                        customRequest={({ file, onSuccess }) => {
                            setImgThumbnail(file);
                            onSuccess();
                        }}
                    >
                        <Button icon={<PlusOutlined />}>Tải lên hình ảnh</Button>
                    </Upload>
                </Form.Item>

                {/* Submit Button */}
                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        block
                        loading={isLoading}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Đang thêm...' : 'Thêm Phòng'}
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default AddRoom;
