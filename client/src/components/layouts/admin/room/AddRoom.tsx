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

    const [imageFiles, setImageFiles] = useState([]); // Array to hold multiple image files
    const [previewImages, setPreviewImages] = useState([]); // Array to hold URLs of images for preview
    const [primaryImageIndex, setPrimaryImageIndex] = useState(null); // To track the primary image

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

    const handleImageUpload = ({ file }) => {
        if (beforeUpload(file)) {
            setImageFiles((prev) => [...prev, file]);
            setPreviewImages((prev) => [...prev, URL.createObjectURL(file)]);
        }
    };

    const handlePrimaryImageSelect = (index) => {
        setPrimaryImageIndex(index);

    };

    const handleSubmit = async (values) => {
        setIsLoading(true);

        const formData = new FormData();
        formData.append('price', values.price);
        formData.append('size_id', values.sizeId);
        formData.append('description', values.description);
        formData.append('quantity', values.quantity);
        formData.append('statusroom', values.statusRoom);

        imageFiles.forEach((file, index) => {
            formData.append('images', file);
            if (index === primaryImageIndex) {
                formData.append('primary_image_index', index); // Specify primary image
            }
        });

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
                message.success("Phòng đã được thêm thành công!");
                setTimeout(() => {
                    navigate('/admin');
                }, 2000);
            } else {
                const errorData = await response.json();
                message.error(`Thêm phòng thất bại: ${errorData.message}`);
            }
        } catch (error) {
            setIsLoading(false);
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

                    label="Hình Ảnh"
                    name="imgThumbnails"
                    rules={[{ required: true, message: 'Vui lòng tải lên hình ảnh phòng!' }]}
                >

                    <Upload
                        accept="image/*"
                        multiple
                        showUploadList={false}
                        customRequest={handleImageUpload}
                    >
                        <Button icon={<PlusOutlined />}>Tải lên hình ảnh</Button>
                    </Upload>

                    {/* Preview Thumbnails */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '16px' }}>
                        {previewImages.map((imgUrl, index) => (
                            <img
                                key={index}
                                src={imgUrl}
                                alt="Preview"
                                onClick={() => handlePrimaryImageSelect(index)}
                                style={{
                                    width: '80px',
                                    height: '80px',
                                    objectFit: 'cover',
                                    border: index === primaryImageIndex ? '2px solid blue' : '1px solid #ccc',
                                    cursor: 'pointer',
                                }}
                            />
                        ))}
                    </div>
                    {primaryImageIndex !== null && <p>Ảnh chính đã chọn: {primaryImageIndex + 1}</p>}
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
