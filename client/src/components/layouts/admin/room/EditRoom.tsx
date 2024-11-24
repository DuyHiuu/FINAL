import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Input, Button, Select, message, InputNumber, Upload } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import useFetchSize from "../../../../api/useFetchSize";
import authClient from "../../../../api/authClient";

const { TextArea } = Input;

const EditRoom = () => {
    const showUrl = "http://localhost:8000/api/rooms";
    const roomImageUrl = "http://localhost:8000/api/roomImages";
    const { id } = useParams();
    const [form] = Form.useForm();
    const [img_thumbnail, setImg_thumbnail] = useState(null);
    const [roomImages, setRoomImages] = useState([]);
    const [removedImages, setRemovedImages] = useState([]);
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
                        quantity: room.quantity,
                        is_booked: room.is_booked,
                    });
                    setImg_thumbnail(room.img_thumbnail);

                    if (room.room_images) {
                        const formattedImages = room.room_images.map((image) => ({
                            uid: image.id,
                            name: image.image,
                            url: image.image,
                            status: "done",
                            isExisting: true,
                        }));
                        setRoomImages(formattedImages);
                    }
                } else {
                    message.error("Không thể lấy thông tin phòng");
                }
            } catch (error) {
                console.error(error);
                message.error("Lỗi khi kết nối API");
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
            quantity: values.quantity,
            img_thumbnail: img_thumbnail,
        };

        const newImages = roomImages.filter((image) => !image.isExisting);
        const existingImages = roomImages.filter((image) => image.isExisting);

        try {
            // Cập nhật thông tin phòng
            const response = await authClient.put(`${showUrl}/${id}`, updateRoom);

            if (response.status !== 200) {
                throw new Error("Lỗi khi cập nhật phòng");
            }

            if (removedImages.length > 0) {
                await Promise.all(
                    removedImages.map(async (image) => {
                        await fetch(`${roomImageUrl}/${image.uid}`, {
                            method: "DELETE",
                        });
                    })
                );
            }

            // Thêm ảnh phụ mới
            if (newImages.length > 0) {
                const formData = new FormData();
                formData.append("room_id", id);
                newImages.forEach((image) => {
                    formData.append("images[]", image.originFileObj);
                });

                const imageResponse = await fetch(`${roomImageUrl}`, {
                    method: "POST",
                    body: formData,
                });

                if (!imageResponse.ok) {
                    throw new Error("Lỗi khi thêm ảnh phụ");
                }
            }

            message.success("Phòng đã sửa thành công");
            navigate("/admin");
        } catch (error) {
            console.error(error);
            message.error("Lỗi khi xử lý yêu cầu");
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImg_thumbnail(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubImageChange = ({ fileList }) => {
        setRoomImages(fileList);
    };

    const handleRemoveImage = (file) => {
        if (file.isExisting) {
            setRemovedImages((prev) => [...prev, file]);
        }
        setRoomImages((prevImages) => prevImages.filter((image) => image.uid !== file.uid));
    };

    const beforeUpload = (file) => {
        if (roomImages.length >= 4) {
            message.warning("Chỉ được tải lên tối đa 4 ảnh phụ");
            return false;
        }
        return true;
    };

    return (
        <Form
            form={form}
            onFinish={handleSubmit}
            onValuesChange={(changedValues) => {
                if (changedValues.quantity !== undefined) {
                    const quantity = changedValues.quantity;
                    form.setFieldsValue({
                        statusroom: quantity === 0 ? "Hết phòng" : "Còn phòng",
                    });
                }
            }}
            className="max-w-lg mx-auto p-6 border border-gray-300 rounded shadow-md"
        >
            <h2 className="text-2xl font-bold mb-4">Sửa Thông Tin Phòng</h2>

            <Form.Item
                label="Giá (VND)"
                name="price"
                rules={[{ required: true, message: "Vui lòng nhập giá phòng!" }]}
            >
                <InputNumber style={{ width: "100%" }} placeholder="Nhập giá phòng" min={0} />
            </Form.Item>

            <Form.Item
                label="Size"
                name="size_id"
                rules={[{ required: true, message: "Vui lòng chọn kích thước phòng!" }]}
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
                label="Số lượng"
                name="quantity"
                rules={[
                    { required: true, message: 'Vui lòng nhập số lượng phòng!' },
                    {
                        validator: (_, value) => {
                            const isBooked = form.getFieldValue('is_booked');
                            console.log(isBooked);

                            if (!value || value >= isBooked) {
                                return Promise.resolve();
                            }
                            return Promise.reject(new Error('Số lượng không hợp lệ!'));
                        },
                    },
                ]}
            >
                <InputNumber style={{ width: "100%" }} placeholder="Nhập số lượng phòng" />
            </Form.Item>

            <Form.Item
                label="Số lượng phòng đang được đặt"
                name="is_booked"
            >
                <InputNumber style={{ width: "100%" }} disabled />
            </Form.Item>

            <Form.Item
                label="Mô Tả"
                name="description"
                rules={[{ required: true, message: "Vui lòng nhập mô tả phòng!" }]}
            >
                <TextArea placeholder="Nhập mô tả phòng" autoSize={{ minRows: 3, maxRows: 5 }} />
            </Form.Item>

            <Form.Item
                label="Trạng Thái"
                name="statusroom"
            >
                <Select placeholder="Chọn trạng thái phòng" disabled>
                    <Select.Option value="Còn phòng">Còn phòng</Select.Option>
                    <Select.Option value="Hết phòng">Hết phòng</Select.Option>
                </Select>
            </Form.Item>

            <Form.Item label="Hình Ảnh Chính">
                {img_thumbnail && (
                    <img src={img_thumbnail} alt="Room Thumbnail" className="h-32 mb-2" />
                )}
                <input type="file" accept="image/*" onChange={handleImageChange} />
            </Form.Item>

            <Form.Item label="Hình Ảnh Phụ">
                <Upload
                    listType="picture-card"
                    fileList={roomImages}
                    onChange={handleSubImageChange}
                    beforeUpload={beforeUpload}
                    onRemove={handleRemoveImage}
                    multiple
                >
                    {roomImages.length < 4 && (
                        <div>
                            <PlusOutlined />
                            <div style={{ marginTop: 8 }}>Tải lên ảnh phụ</div>
                        </div>
                    )}
                </Upload>
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
                    Sửa
                </Button>
            </Form.Item>
        </Form>
    );
};

export default EditRoom;
