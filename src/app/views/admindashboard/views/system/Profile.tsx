import {
  BookOpen,
  ClipboardList,
  FileCheck,
  MessageCircle,
  UserRound,
  Eye,
  MessageSquare,
  UserCog,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface HomeCard {
  title: string;
  description: string;
  buttonText: string;
  icon: React.ElementType;
  buttonIcon: React.ElementType;
  path: string;
}

const homeCards: HomeCard[] = [
  {
    title: "My Courses",
    description: "View all registered courses",
    buttonText: "View",
    icon: BookOpen,
    buttonIcon: Eye,
    path: "/courses",
  },
  {
    title: "My Assignments",
    description: "View all assignment and submissions",
    buttonText: "View",
    icon: ClipboardList,
    buttonIcon: Eye,
    path: "/assignments",
  },
  {
    title: "Quizzes",
    description: "View all quizzes and submissions",
    buttonText: "View",
    icon: FileCheck,
    buttonIcon: Eye,
    path: "/quiz",
  },
  {
    title: "Discussions",
    description: "Manage Discussions",
    buttonText: "Manage",
    icon: MessageCircle,
    buttonIcon: MessageSquare,
    path: "/forum",
  },
  {
    title: "Profile",
    description: "Manage Profile, edit and update.",
    buttonText: "Manage",
    icon: UserRound,
    buttonIcon: UserCog,
    path: "/profile",
  },
];

export default function StudentHome() {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-full bg-white">
      {/* Page Title */}
      <div className="px-4 pt-3">
        <h1 className="text-xl font-semibold text-slate-800">
          Home
        </h1>
      </div>

      {/* Divider / Breadcrumb Area */}
      <div className="mt-5 border-y border-slate-200 px-4 py-3">
        <div className="flex items-center">
          <span className="text-slate-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </span>
        </div>
      </div>

      {/* Cards */}
      <div className="flex w-full justify-center px-4 pt-14 pb-10">
        <div className="grid w-full max-w-[900px] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {homeCards.map((card) => {
            const Icon = card.icon;
            const ButtonIcon = card.buttonIcon;

            return (
              <div
                key={card.title}
                className="flex min-h-[165px] flex-col overflow-hidden bg-white shadow-sm"
              >
                {/* Blue Icon Header */}
                <div className="flex h-[68px] items-center justify-center bg-[#0085d5]">
                  <Icon
                    className="h-11 w-11 text-white"
                    strokeWidth={1.5}
                  />
                </div>

                {/* Card Content */}
                <div className="flex flex-1 flex-col px-3 pt-2">
                  <h3 className="text-[15px] font-semibold text-slate-800">
                    {card.title}
                  </h3>

                  <p className="mt-1 min-h-[34px] text-[11px] leading-[15px] text-slate-500">
                    {card.description}
                  </p>
                </div>

                {/* Blue Action Button */}
                <button
                  type="button"
                  onClick={() => navigate(card.path)}
                  className="flex h-8 items-center justify-center gap-2 bg-[#006dcc] text-xs font-medium text-white transition hover:bg-[#005ca8]"
                >
                  <ButtonIcon className="h-3.5 w-3.5" />

                  <span>{card.buttonText}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}