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
    const [quantity, setQuantity] = useState('');
    const [statusRoom, setStatusRoom] = useState('Còn phòng');
    const [imgThumbnail, setImgThumbnail] = useState(null);
    const [imgSubImages, setImgSubImages] = useState([]); // State để lưu ảnh phụ
    const [previewImage, setPreviewImage] = useState(null); // State để lưu URL ảnh xem trước
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const storeUrl = "http://localhost:8000/api/rooms";
    const { sizes } = useFetchSize();

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

    const handleSubImageChange = ({ fileList }) => {
        if (fileList.length > 4) {
            message.error('Chỉ được chọn tối đa 4 ảnh phụ');
            return;
        }
        setImgSubImages(fileList);
    };

    const handleSubmit = async (values) => {
        setIsLoading(true);

        const formData = new FormData();
        formData.append('price', values.price);
        formData.append('size_id', values.sizeId);
        formData.append('description', values.description);
        formData.append('quantity', values.quantity);
        formData.append('statusroom', values.statusRoom);
        formData.append('img_thumbnail', imgThumbnail);

        // Đẩy ảnh phụ vào formData
        imgSubImages.forEach((file) => {
            formData.append('img_sub_images[]', file.originFileObj); // Thêm ảnh phụ vào formData
        });

        try {
            const response = await fetch(storeUrl, {
                method: 'POST',
                body: formData,
            });

            setIsLoading(false);

            if (response.ok) {
                const data = await response.json();
                console.log('Phòng đã thêm thành công:', data);
                message.success("Phòng đã được thêm thành công!");
                setTimeout(() => {
                    navigate('/admin');
                }, 2000);
            } else {
                const errorData = await response.json();
                console.error('Lỗi khi thêm phòng:', errorData.message);
                message.error(`Thêm phòng thất bại: ${errorData.message}`);
            }
        } catch (error) {
            setIsLoading(false);
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

                {/* Số lượng */}
                <Form.Item
                    label="Số lượng"
                    name="quantity"
                    rules={[{ required: true, message: 'Vui lòng nhập số lượng phòng!' }]}
                >
                    <Input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
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

                {/* Hình ảnh chính */}
                <Form.Item
                    label="Hình Ảnh Chính"
                    name="imgThumbnail"
                    rules={[{ required: true, message: 'Vui lòng tải lên hình ảnh phòng!' }]}>
                    <Upload
                        accept="image/*"
                        showUploadList={false}
                        beforeUpload={beforeUpload}
                        customRequest={({ file, onSuccess }) => {
                            setImgThumbnail(file);
                            setPreviewImage(URL.createObjectURL(file)); // Tạo URL xem trước
                            onSuccess();
                        }}
                    >
                        <Button icon={<PlusOutlined />}>Tải lên hình ảnh</Button>
                    </Upload>
                    {previewImage && (
                        <img
                            src={previewImage}
                            alt="Preview"
                            style={{ marginTop: '16px', width: '40%', maxHeight: '300px', objectFit: 'cover' }}
                        />
                    )}
                </Form.Item>

                {/* Hình ảnh phụ */}
                <Form.Item
                    label="Hình Ảnh Phụ"
                    name="imgSubImages"
                >
                    <Upload
                        accept="image/*"
                        listType="picture-card"
                        fileList={imgSubImages}
                        onChange={handleSubImageChange}
                        beforeUpload={beforeUpload}
                        multiple
                    >
                        <div>
                            <PlusOutlined />
                            <div style={{ marginTop: 8 }}>Tải lên</div>
                        </div>
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
