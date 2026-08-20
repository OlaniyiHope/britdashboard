import {
  CreditCard,
  FileText,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

const MakePayment = () => {
  const outstandingPayments = [
    {
      id: "PAY-001",
      title: "Application Fee",
      application: "2025/2026 Batch C Application",
      program: "BSc. Computer Science",
      amount: 10000,
      status: "Unpaid",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fb] p-6 md:p-8">

      {/* HEADER */}
      <div className="mb-7">
        <h1 className="text-[20px] font-semibold text-[#333]">
          Make Payment
        </h1>

        <p className="text-[12px] text-[#888] mt-1">
          View your outstanding payments and complete payment securely.
        </p>
      </div>

      {/* NOTICE */}
      <div className="flex gap-3 items-start bg-[#fff8e6] border border-[#f1df9b] rounded-md p-4 mb-6">

        <AlertCircle
          size={18}
          className="text-[#b7791f] mt-0.5"
        />

        <div>
          <p className="text-[12px] font-medium text-[#7a5a13]">
            Outstanding Payment
          </p>

          <p className="text-[11px] text-[#92752c] mt-1">
            You have an outstanding payment that needs to be completed.
          </p>
        </div>

      </div>

      {/* PAYMENTS */}
      <div className="space-y-4">

        {outstandingPayments.map((payment) => (

          <div
            key={payment.id}
            className="bg-white border border-[#ddd] rounded-md p-5"
          >

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

              {/* DETAILS */}
              <div className="flex gap-4">

                <div className="w-11 h-11 rounded-full bg-blue-50 text-[#006b5d] flex items-center justify-center flex-shrink-0">
                  <FileText size={20} />
                </div>

                <div>

                  <h2 className="text-[14px] font-semibold text-[#333]">
                    {payment.title}
                  </h2>

                  <p className="text-[11px] text-[#777] mt-1">
                    {payment.application}
                  </p>

                  <p className="text-[11px] text-[#999] mt-1">
                    {payment.program}
                  </p>

                </div>

              </div>

              {/* AMOUNT + BUTTON */}
              <div className="flex items-center justify-between md:justify-end gap-6">

                <div className="text-right">

                  <p className="text-[10px] text-[#999]">
                    Amount Due
                  </p>

                  <p className="text-[18px] font-bold text-[#333]">
                    ₦{payment.amount.toLocaleString()}
                  </p>

                </div>

                <Link
                  to={`/student/dashboard/payment/review/${payment.id}`}
                  className="
                    inline-flex
                    items-center
                    gap-2
                    bg-[#006b5d]
                    hover:bg-[#005548]
                    text-white
                    text-[11px]
                    font-medium
                    px-4
                    py-2.5
                    rounded-[3px]
                  "
                >
                  <CreditCard size={14} />
                  PAY NOW
                  <ArrowRight size={13} />
                </Link>

              </div>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
};

export default MakePayment;