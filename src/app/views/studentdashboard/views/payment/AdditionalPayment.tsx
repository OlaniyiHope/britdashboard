import {
  CreditCard,
  WalletCards,
  ArrowRight,
  FileText,
  Info,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

interface AdditionalPaymentItem {
  id: string;
  title: string;
  description: string;
  amount: number;
  category: string;
  available: boolean;
}

const additionalPayments: AdditionalPaymentItem[] = [
  {
    id: "HOSTEL-001",
    title: "Hostel & Accommodation Fee",
    description:
      "Payment for hostel accommodation for the current academic session.",
    amount: 100000,
    category: "Accommodation",
    available: true,
  },
    {
    id: "MEDICAL-001",
    title: "Medical Fee",
    description:
      "Payment for medical fee for the current academic session",
    amount: 10000,
    category: "Medical",
    available: true,
  },
  {
    id: "LATE-001",
    title: "Late Registration Fee",
    description:
      "Fee applicable to students completing registration after the deadline.",
    amount: 5000,
    category: "Registration",
    available: true,
  },
  {
    id: "EXAMINATION-001",
    title: "Examination Fee",
    description:
      "Fee payment for examination.",
    amount: 10000,
    category: "Examination",
    available: true,
  },
  {
    id: "CAUTION-001",
    title: "Caution Fee",
    description:
      "Fee payment for caution fee.",
    amount: 5000,
    category: "Registration",
    available: true,
  },
  {
    id: "ID-001",
    title: "Student Identity Card",
    description:
      "Payment for the production and processing of your student identity card.",
    amount: 5000,
    category: "Student Services",
    available: true,
  },
  {
    id: "DIGITALLIBRABARY-001",
    title: "Digital Library and E-book Subscription",
    description:
      "Payment for the production and processing of your student identity card.",
    amount: 10000,
    category: "Library",
    available: true,
  },
  {
    id: "HANDBOOK-001",
    title: "Student Handbook",
    description:
      "Payment for the production and processing of your student identity card.",
    amount: 1000,
    category: "Library",
    available: true,
  },
  {
    id: "TECHNOLOGY-001",
    title: "Technology and Internet Fee",
    description:
      "Payment for the production and processing of your student identity card.",
    amount: 10000,
    category: "Library",
    available: true,
  },
  {
    id: "LABORATORY-001",
    title: "Laboratory, Workshop and Studio Fee",
    description:
      "Payment for the production and processing of your student identity card.",
    amount: 15000,
    category: "Library",
    available: true,
  },
  {
    id: "TRANSCRIPT-001",
    title: "Academic Transcript",
    description:
      "Payment for the processing of an official academic transcript.",
    amount: 10000,
    category: "Academic Services",
    available: true,
  },
];

const AdditionalPayment = () => {
  const navigate = useNavigate();

  const handlePayment = (payment: AdditionalPaymentItem) => {
    navigate(`/student/dashboard/payment/review/${payment.id}`);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fb] text-[#333]">

      {/* PAGE HEADER */}
      <div className="border-b border-[#ddd] bg-white px-7 py-5">
        <h1 className="text-[18px] font-medium text-[#333]">
          Additional Payment
        </h1>
      </div>

      <div className="px-6 md:px-8 py-8">

        {/* BREADCRUMB */}
        <div className="flex items-center gap-2 text-[12px] text-[#999] mb-7">

          <Link
            to="/student/dashboard"
            className="hover:text-[#006b5d] transition"
          >
            Dashboard
          </Link>

          <span>/</span>

          <span>Payment</span>

          <span>/</span>

          <span className="text-[#555]">
            Additional Payment
          </span>

        </div>

        {/* INTRODUCTION */}
        <div className="mb-7">

          <h2 className="text-[20px] font-semibold text-[#333]">
            Additional Payments
          </h2>

          <p className="text-[12px] text-[#888] mt-1">
            Make payments for additional services and charges available to
            you.
          </p>

        </div>

        {/* INFORMATION */}
        <div className="
          bg-[#f0f8f6]
          border
          border-[#cce5df]
          rounded-md
          p-4
          mb-7
          flex
          items-start
          gap-3
        ">

          <Info
            size={18}
            className="text-[#006b5d] mt-0.5 flex-shrink-0"
          />

          <div>

            <p className="text-[12px] font-medium text-[#006b5d]">
              Important Information
            </p>

            <p className="text-[11px] text-[#687] mt-1 leading-5">
              Select the payment you want to make. You will be able to review
              the payment details before being redirected to Paystack.
            </p>

          </div>

        </div>

        {/* PAYMENT CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

          {additionalPayments
            .filter((payment) => payment.available)
            .map((payment) => (

              <div
                key={payment.id}
                className="
                  bg-white
                  border
                  border-[#ddd]
                  rounded-md
                  overflow-hidden
                  hover:shadow-sm
                  transition
                "
              >

                {/* CARD TOP */}
                <div className="p-5">

                  <div className="flex items-start justify-between gap-4">

                    <div className="
                      w-11
                      h-11
                      rounded-full
                      bg-[#eef8f6]
                      text-[#006b5d]
                      flex
                      items-center
                      justify-center
                      flex-shrink-0
                    ">
                      <WalletCards size={20} />
                    </div>

                    <span className="
                      bg-[#f0f4f8]
                      text-[#687]
                      text-[10px]
                      px-2.5
                      py-1
                      rounded
                    ">
                      {payment.category}
                    </span>

                  </div>

                  <h3 className="
                    text-[14px]
                    font-semibold
                    text-[#333]
                    mt-5
                  ">
                    {payment.title}
                  </h3>

                  <p className="
                    text-[11px]
                    text-[#888]
                    leading-5
                    mt-2
                    min-h-[44px]
                  ">
                    {payment.description}
                  </p>

                </div>

                {/* CARD BOTTOM */}
                <div className="
                  border-t
                  border-[#eee]
                  px-5
                  py-4
                  bg-[#fcfcfc]
                ">

                  <div className="
                    flex
                    items-center
                    justify-between
                    gap-4
                  ">

                    <div>

                      <p className="text-[10px] text-[#999]">
                        Amount
                      </p>

                      <p className="
                        text-[18px]
                        font-bold
                        text-[#006b5d]
                        mt-0.5
                      ">
                        ₦{payment.amount.toLocaleString()}
                      </p>

                    </div>

                    <button
                      onClick={() => handlePayment(payment)}
                      className="
                        inline-flex
                        items-center
                        gap-2
                        bg-[#006b5d]
                        hover:bg-[#005548]
                        text-white
                        text-[10px]
                        font-medium
                        px-3.5
                        py-2.5
                        rounded-[3px]
                        transition
                      "
                    >
                      <CreditCard size={13} />
                      PAY NOW
                      <ArrowRight size={12} />
                    </button>

                  </div>

                </div>

              </div>

            ))}

        </div>

        {/* EMPTY STATE */}
        {additionalPayments.filter((payment) => payment.available).length ===
          0 && (
          <div className="
            bg-white
            border
            border-[#ddd]
            rounded-md
            py-16
            text-center
          ">

            <FileText
              size={38}
              className="mx-auto text-[#bbb] mb-3"
            />

            <h3 className="text-[14px] font-medium text-[#555]">
              No Additional Payments
            </h3>

            <p className="text-[11px] text-[#999] mt-1">
              There are currently no additional payments available for you.
            </p>

          </div>
        )}

      </div>

    </div>
  );
};

export default AdditionalPayment;