import {
  XCircle,
  RefreshCcw,
  ArrowLeft,
} from "lucide-react";
import { Link } from "react-router-dom";

const PaymentFailed = () => {
  return (
    <div className="min-h-screen bg-[#f8f9fb] flex items-center justify-center p-6">

      <div className="bg-white border border-[#ddd] rounded-md w-full max-w-[500px] text-center p-8">

        <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto">
          <XCircle size={34} />
        </div>

        <h1 className="text-[21px] font-semibold text-[#333] mt-5">
          Payment Not Completed
        </h1>

        <p className="text-[12px] text-[#888] mt-2">
          We could not confirm your payment. No payment should be marked as
          successful until it has been verified.
        </p>

        <div className="flex justify-center gap-3 mt-7">

          <Link
            to="/student/dashboard/payment/make-payment"
            className="
              bg-[#006b5d]
              text-white
              text-[11px]
              px-5
              py-2.5
              rounded
              flex
              items-center
              gap-2
            "
          >
            <RefreshCcw size={14} />
            Try Again
          </Link>

          <Link
            to="/student/dashboard"
            className="
              border
              border-[#ccc]
              text-[#555]
              text-[11px]
              px-5
              py-2.5
              rounded
              flex
              items-center
              gap-2
            "
          >
            <ArrowLeft size={14} />
            Dashboard
          </Link>

        </div>

      </div>

    </div>
  );
};

export default PaymentFailed;