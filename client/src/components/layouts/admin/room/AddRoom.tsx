import React, { useState } from 'react';
import useFetchSize from '../../../../api/useFetchSize';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Input, Button, Select, Upload, message } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';

const { Option } = Select;

const AddRoom = () => {
    const [sizeId, setSizeId] = useState('');
    const { id } = useParams();
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [quantity, setQuantity] = useState('');
    const [statusRoom, setStatusRoom] = useState('Còn phòng');
    const [imgThumbnail, setImgThumbnail] = useState(null);
    const [imgSubImages, setImgSubImages] = useState([]);
    const [previewImage, setPreviewImage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const storeUrl = "http://localhost:8000/api/rooms";
    const roomImageUrl = "http://localhost:8000/api/roomImages";
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
        formData.append('statusroom', 'Còn phòng');
        formData.append('img_thumbnail', imgThumbnail);

        // Đẩy ảnh phụ vào formData
        imgSubImages.forEach((file) => {
            if (file.originFileObj) {
                formData.append('img_sub_images[]', file.originFileObj);
            } else {
                console.error("Không tìm thấy file gốc:", file);
            }
        });

        try {
            // Gửi yêu cầu đến storeUrl (Lưu thông tin phòng)
            const roomResponse = await fetch(storeUrl, {
                method: 'POST',
                body: formData,
            });

            if (!roomResponse.ok) {
                const roomErrorData = await roomResponse.json();
                console.error('Lỗi khi thêm phòng:', roomErrorData.message);
                message.error(`Thêm phòng thất bại: ${roomErrorData.message}`);
                setIsLoading(false);
                return;
            }

            const roomData = await roomResponse.json();
            console.log('Phòng đã thêm thành công:', roomData);

            // Sau khi thêm phòng thành công, gửi yêu cầu thêm hình ảnh phòng
            const imageFormData = new FormData();
            imgSubImages.forEach((file) => {
                if (file.originFileObj) {
                    imageFormData.append('img_sub_images[]', file.originFileObj);
                }
            });

            const imageResponse = await fetch(roomImageUrl, {
                method: 'POST',
                body: imageFormData,
            });

            // if (!imageResponse.ok) {
            //     const imageErrorData = await imageResponse.json();
            //     console.error('Lỗi khi thêm hình ảnh phòng:', imageErrorData.message);
            //     message.error(`Thêm hình ảnh phòng thất bại: ${imageErrorData.message}`);
            //     setIsLoading(false);
            //     return;
            // }

            const imageData = await imageResponse.json();
            console.log('Hình ảnh phòng đã được thêm thành công:', imageData);
            message.success("Phòng và hình ảnh đã được thêm thành công!");

            setTimeout(() => {
                navigate('/admin');
            }, 2000);
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
                    rules={[
                        { required: true, message: 'Vui lòng nhập số lượng phòng!' },
                        {
                            validator: (_, value) => {
                                if (!value || value >= 1) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('Số lượng không nhỏ hơn 1!'));
                            },
                        },
                    ]}
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
                    rules={[
                        { required: true, message: 'Vui lòng nhập số lượng phòng!' },
                        {
                            validator: (_, value) => {
                                if (!value || value >= 1) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('Số lượng không nhỏ hơn 1!'));
                            },
                        },
                    ]}
                >
                    <Input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        className="w-full"
                    />
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
                    rules={[{ required: true, message: 'Vui lòng tải lên hình ảnh phòng!' }]}
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
