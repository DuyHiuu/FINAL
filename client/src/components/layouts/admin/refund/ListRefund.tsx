import React, { useEffect, useState } from "react";

interface Refund {
    id: number;
    payment_id: number;
    bank_name: string;
    bank_seri: string;
    bank_type_name: string;
    amount: string;
    status: string;
}

const ListRefund: React.FC = () => {
    const [refunds, setRefunds] = useState<Refund[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRefunds = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch("http://localhost:5173/admin/refund");
                if (!response.ok) {
                    throw new Error(`HTTP Error: ${response.status}`);
                }
                const data = await response.json();
                setRefunds(data);
            } catch (err: any) {
                setError(err.message || "Có lỗi xảy ra khi tải dữ liệu");
            } finally {
                setLoading(false);
            }
        };

        fetchRefunds();
    }, []);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Danh sách hoàn tiền</h1>
            {loading && <p>Đang tải...</p>}
            {error && <p className="text-red-500">Lỗi: {error}</p>}
            {!loading && !error && (
                <table className="table-auto w-full border border-gray-200">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border px-4 py-2">ID</th>
                            <th className="border px-4 py-2">Mã thanh toán</th>
                            <th className="border px-4 py-2">Ngân hàng</th>
                            <th className="border px-4 py-2">Số thẻ</th>
                            <th className="border px-4 py-2">Loại tài khoản</th>
                            <th className="border px-4 py-2">Số tiền</th>
                            <th className="border px-4 py-2">Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody>
                        {refunds.map((refund) => (
                            <tr key={refund.id} className="hover:bg-gray-50">
                                <td className="border px-4 py-2 text-center">{refund.id}</td>
                                <td className="border px-4 py-2 text-center">{refund.payment_id}</td>
                                <td className="border px-4 py-2">{refund.bank_name}</td>
                                <td className="border px-4 py-2">{refund.bank_seri}</td>
                                <td className="border px-4 py-2">{refund.bank_type_name}</td>
                                <td className="border px-4 py-2 text-right">{refund.amount} VND</td>
                                <td
                                    className={`border px-4 py-2 text-center ${refund.status === "Pending"
                                            ? "text-yellow-600"
                                            : refund.status === "Approved"
                                                ? "text-green-600"
                                                : "text-red-600"
                                        }`}
                                >
                                    {refund.status}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default ListRefund;
