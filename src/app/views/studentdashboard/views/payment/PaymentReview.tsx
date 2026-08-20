import {
  CreditCard,
  FileText,
  ShieldCheck,
  ArrowLeft,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const PaymentReview = () => {
  const navigate = useNavigate();
  const { paymentId } = useParams();

  const payment = {
    id: paymentId,
    application: "2025/2026 Batch C Application",
    program: "BSc. Computer Science",
    type: "Application Fee",
    amount: 10000,
  };

  const handlePayment = async () => {
    // We will connect this to your backend/Paystack here.
    console.log("Initialize payment:", payment.id);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fb] p-6 md:p-8">

      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-[12px] text-[#777] hover:text-[#006b5d] mb-6"
      >
        <ArrowLeft size={15} />
        Back
      </button>

      <div className="max-w-[700px] mx-auto">

        <h1 className="text-[20px] font-semibold text-[#333]">
          Payment Review
        </h1>

        <p className="text-[12px] text-[#888] mt-1 mb-6">
          Review your payment details before proceeding.
        </p>

        <div className="bg-white border border-[#ddd] rounded-md">

          {/* TITLE */}
          <div className="p-5 border-b border-[#eee] flex items-center gap-3">

            <div className="w-10 h-10 rounded-full bg-blue-50 text-[#006b5d] flex items-center justify-center">
              <CreditCard size={19} />
            </div>

            <div>
              <h2 className="text-[14px] font-semibold text-[#333]">
                Payment Details
              </h2>

              <p className="text-[11px] text-[#999]">
                Application payment
              </p>
            </div>

          </div>

          {/* DETAILS */}
          <div className="p-6 space-y-5">

            <div className="flex justify-between gap-5">
              <span className="text-[12px] text-[#999]">
                Application
              </span>

              <span className="text-[12px] text-[#444] font-medium text-right">
                {payment.application}
              </span>
            </div>

            <div className="flex justify-between gap-5">
              <span className="text-[12px] text-[#999]">
                Programme
              </span>

              <span className="text-[12px] text-[#444] font-medium">
                {payment.program}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-[12px] text-[#999]">
                Payment Type
              </span>

              <span className="text-[12px] text-[#444] font-medium">
                {payment.type}
              </span>
            </div>

            <div className="border-t border-[#eee] pt-5 flex justify-between">

              <span className="text-[14px] font-semibold text-[#333]">
                Total
              </span>

              <span className="text-[20px] font-bold text-[#006b5d]">
                ₦{payment.amount.toLocaleString()}
              </span>

            </div>

          </div>

          {/* SECURITY */}
          <div className="mx-6 mb-6 bg-[#f5faf9] border border-[#d8eee9] rounded p-4 flex gap-3">

            <ShieldCheck
              size={18}
              className="text-[#006b5d]"
            />

            <p className="text-[11px] text-[#666] leading-5">
              You will be redirected to Paystack to securely complete your
              payment.
            </p>

          </div>

          {/* BUTTONS */}
          <div className="px-6 pb-6 flex justify-end gap-3">

            <button
              onClick={() => navigate(-1)}
              className="
                border
                border-[#ccc]
                text-[#666]
                text-[11px]
                px-5
                py-2.5
                rounded
              "
            >
              Cancel
            </button>

            <button
              onClick={handlePayment}
              className="
                bg-[#006b5d]
                hover:bg-[#005548]
                text-white
                text-[11px]
                font-medium
                px-5
                py-2.5
                rounded
                flex
                items-center
                gap-2
              "
            >
              <CreditCard size={14} />
              Continue to Pay
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};

export default PaymentReview;