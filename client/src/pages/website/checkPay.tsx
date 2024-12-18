import { useEffect, useState } from "react";
import { useCheckPayMutation } from "../../api/payment";
import { Link } from "react-router-dom";
const CheckPay = () => {
  const [checkPayment] = useCheckPayMutation();
  const [checkRequest, setRequest] = useState(false);
  const [mess, setMess] = useState("");
  const [checkPay, setCheckPay] = useState<any>(null);
  const url = new URL(window.location.href);
  const urlSearchParams = new URLSearchParams(
    new URL(window.location.href).search
  );
  const vnp_Amount = urlSearchParams.get("vnp_Amount");
  const vnp_BankCode = urlSearchParams.get("vnp_BankCode");
  const vnp_BankTranNo = urlSearchParams.get("vnp_BankTranNo");
  const vnp_CardType = urlSearchParams.get("vnp_CardType");
  const vnp_OrderInfo = urlSearchParams.get("vnp_OrderInfo");
  const vnp_PayDate = urlSearchParams.get("vnp_PayDate");
  const vnp_ResponseCode = urlSearchParams.get("vnp_ResponseCode");
  const vnp_TmnCode = urlSearchParams.get("vnp_TmnCode");
  const vnp_TransactionNo = urlSearchParams.get("vnp_TransactionNo");
  const vnp_TransactionStatus = urlSearchParams.get("vnp_TransactionStatus");
  const vnp_TxnRef = urlSearchParams.get("vnp_TxnRef");
  const vnp_SecureHash = urlSearchParams.get("vnp_SecureHash");
  useEffect(() => {
    if (url.pathname === "/check_pay" && checkRequest === false) {
      const data = {
        vnp_Amount: vnp_Amount,
        vnp_BankCode: vnp_BankCode,
        vnp_BankTranNo: vnp_BankTranNo,
        vnp_OrderInfo: vnp_OrderInfo,
        vnp_PayDate: vnp_PayDate,
        vnp_ResponseCode: vnp_ResponseCode,
        vnp_TmnCode: vnp_TmnCode,
        vnp_TransactionNo: vnp_TransactionNo,
        vnp_TransactionStatus: vnp_TransactionStatus,
        vnp_TxnRef: vnp_TxnRef,
        vnp_SecureHash: vnp_SecureHash,
        vnp_CardType: vnp_CardType,
      };
      checkPayment(data).then((req: any) => {
        if (req?.data?.Message) {
          setMess(req?.data?.Message);
          setRequest(true);
          setCheckPay(true);
        } else if (req?.data?.Error) {
          setMess(req?.data?.Error);
          setRequest(true);
          setCheckPay(false);
        }
      });
      return;
    }
  }, [checkRequest]);
  const moneny = (Number(vnp_Amount) / 100)
    ?.toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const date: Array<number> = vnp_PayDate?.split("").map(Number) as [];
  const year = date.slice(0, 4).join("");
  const month = date.slice(4, 6).join("");
  const day = date.slice(6, 8).join("");
  const hour = date.slice(8, 10).join("");
  const mins = date.slice(10, 12).join("");
  const second = date.slice(12, 14).join("");
  const timePay = `${hour}:${mins}:${second} , ${day}/${month}/${year}`;
  return (
    <div className="pay-success-screen h-screen grid place-content-center">
      {!checkRequest && (
        <div
          className="inline-block bg-gray-50 mt-[50px] h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
          role="status"
        >
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
            Loading...
          </span>
        </div>
      )}
      {checkPay === true && checkRequest && (
        <div className="pay-success-box bg-white h-[500px] w-[600px] rounded-xl">
          <div className="check-icon text-center mt-10 space-y-3">
            <p className="font-medium text-lg">{mess}</p>
            <span className="block text-4xl text-[#81c038] font-medium">
              {moneny} đ{" "}
            </span>
          </div>
          <div className="pay-content text-center mt-10 space-y-3">
            <p>
              Thời gian giao dịch:{" "}
              <span className=" font-medium">{timePay}</span>.
            </p>
            <p>
              Mã giao dịch của bạn là{" "}
              <span className="text-[#81c038] font-medium">{vnp_TxnRef}</span>.
            </p>
            <p>
              Xem chi tiết thông tin vé tại đây{" "}
              <a
                href="http://localhost:5173/history1"
                className="text-blue-500"
              >
                Payment History
              </a>
              .
            </p>{" "}
            <div className="pt-5">
              <Link to="/">
                <button className="bg-blue-500 text-white text-lg font-medium rounded-lg p-4">
                  Quay về trang chủ
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {checkPay === false && checkRequest && (
        <div className="pay-success-box bg-white h-[500px] w-[600px] rounded-xl">
          <div className="check-icon text-center mt-10 space-y-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="80"
              height="80"
              fill="red"
              className="bi bi-exclamation-circle-fill mx-auto"
              viewBox="0 0 24 24"
            >
              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4m.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2" />
            </svg>
            <p className="font-medium text-2xl">{mess}</p>
            <span className="block text-4xl text-red-500 font-medium">
              {moneny} đ
            </span>
          </div>
          <div className="pay-content text-center mt-10 space-y-3">
            <p>Đã có sự cố xảy ra trong lúc thanh toán</p>
            <p>Vui lòng thử lại</p>
            <div className="pt-5">
              <div className="pt-5">
                <Link to="/">
                  <button className="bg-blue-500 text-white text-lg font-medium rounded-lg p-4">
                    Quay về trang chủ
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default CheckPay;
