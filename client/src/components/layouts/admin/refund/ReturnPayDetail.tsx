import React, { useEffect, useState } from "react";
import { Form, Input, Button, Spin, Typography, message, Card, Row, Col, DatePicker, Divider } from "antd";
import { useParams } from "react-router-dom";
import { PulseLoader } from "react-spinners";;
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const ReturnPayDetail = () => {
    const showUrl = "http://localhost:8000/api/pay_return";
    const [data, setData] = useState(null);
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`${showUrl}/${id}`, {
                    method: "get",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                if (!res.ok) {
                    throw new Error(`Lỗi: ${res.status} - ${res.statusText}`);
                }
                const responseData = await res.json();
                setData(responseData.data); // Đảm bảo cấu trúc dữ liệu phù hợp
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, [id]);

    if (!data) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-white fixed top-0 left-0 w-full h-full z-50">
                <PulseLoader color="#33CCFF" size={15} margin={2} />
            </div>
        );
    }

    const pay_id = data?.payment?.payment_id;


    const handleSubmit = async () => {
        setLoading(true);

        try {
            const response = await fetch(`http://localhost:8000/api/payments/${pay_id}/changeStatus`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ status: 9 }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Có lỗi xảy ra!");
            }

            message.success("Thành công!");

            navigate('/admin/returnPay');

        } catch (error) {
            message.error("Đã có lỗi xảy ra. Vui lòng thử lại!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between max-w-7xl mx-auto my-10 p-6 bg-white shadow-lg rounded-lg mt-24">
            <div className="w-full lg:w-1/2 p-6 flex flex-col space-y-4 mx-auto">
                <Title level={2}>Thông tin</Title>

                <Form
                    layout="vertical"
                    onFinish={handleSubmit}
                    className="flex flex-col space-y-4 mt-4"
                    initialValues={{
                        bank_name: data?.bank_name,
                        bank_seri: data?.bank_seri,
                        bank_type_name: data?.bank_type_name,
                    }}
                >
                    <Form.Item
                        name="bank_name"
                        label="Tên chủ tài khoản"
                    >
                        <Input
                            className="border border-gray-300 p-3 rounded-lg"
                            readOnly
                        />
                    </Form.Item>
                    <Form.Item
                        name="bank_seri"
                        label="Số tài khoản ngân hàng"
                    >
                        <Input
                            className="border border-gray-300 p-3 rounded-lg"
                            readOnly
                        />
                    </Form.Item>
                    <Form.Item
                        name="bank_type_name"
                        label="Ngân hàng của bạn"
                    >
                        <Input
                            className="border border-gray-300 p-3 rounded-lg"
                            readOnly
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                        >
                            {loading ? (
                                <div className="flex items-center justify-center">
                                    <Spin size="small" />
                                </div>
                            ) : (
                                "Đã thanh toán"
                            )}
                        </Button>

                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default ReturnPayDetail;