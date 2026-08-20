import {
  CheckCircle,
  FileText,
  Receipt,
  ArrowRight,
} from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();

  const reference = searchParams.get("reference");

  return (
    <div className="min-h-screen bg-[#f8f9fb] flex items-center justify-center p-6">

      <div className="bg-white border border-[#ddd] rounded-md w-full max-w-[550px] text-center p-8">

        <div className="w-16 h-16 rounded-full bg-green-50 text-green-600 flex items-center justify-center mx-auto">
          <CheckCircle size={34} />
        </div>

        <h1 className="text-[22px] font-semibold text-[#333] mt-5">
          Payment Successful
        </h1>

        <p className="text-[12px] text-[#888] mt-2">
          Your payment has been successfully verified.
        </p>

        <div className="bg-[#f8f9fb] rounded-md p-5 mt-7 text-left">

          <div className="flex justify-between py-2">
            <span className="text-[11px] text-[#999]">
              Payment
            </span>

            <span className="text-[12px] font-medium">
              Application Fee
            </span>
          </div>

          <div className="flex justify-between py-2">
            <span className="text-[11px] text-[#999]">
              Amount
            </span>

            <span className="text-[14px] font-bold text-[#006b5d]">
              ₦10,000
            </span>
          </div>

          <div className="flex justify-between py-2">
            <span className="text-[11px] text-[#999]">
              Reference
            </span>

            <span className="text-[10px] font-mono">
              {reference || "N/A"}
            </span>
          </div>

        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-6">

          <Link
            to="/student/dashboard/payment/history"
            className="
              flex-1
              border
              border-[#ccc]
              text-[#555]
              py-2.5
              rounded
              text-[11px]
              flex
              items-center
              justify-center
              gap-2
            "
          >
            <Receipt size={14} />
            Payment History
          </Link>

          <Link
            to="/student/dashboard/application/my-applications"
            className="
              flex-1
              bg-[#006b5d]
              text-white
              py-2.5
              rounded
              text-[11px]
              flex
              items-center
              justify-center
              gap-2
            "
          >
            <FileText size={14} />
            My Application
            <ArrowRight size={13} />
          </Link>

        </div>

      </div>

    </div>
  );
};

export default PaymentSuccess;