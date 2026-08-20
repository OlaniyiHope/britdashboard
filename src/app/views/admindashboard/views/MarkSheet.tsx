import { Bell, Home, MoreVertical, Wrench } from "lucide-react";

interface NotificationItem {
  text: React.ReactNode;
  time: string;
}

interface NotificationGroup {
  date: string;
  notifications: NotificationItem[];
}

const StudentNotification = () => {
  const notificationGroups: NotificationGroup[] = [
    {
      date: "August 18th 2026",
      notifications: [
        {
          text: (
            <>
              <strong>GABRIEL Samaila</strong> has started MTH 101 Lectures meeting
            </>
          ),
          time: "14 hours ago",
        },
        {
          text: (
            <>
              <strong>ABDULSALAM Abdulwasiu</strong> has invited you to a meeting
              for Differential and Integral Calculus - MATH 105
            </>
          ),
          time: "14 hours ago",
        },
        {
          text: (
            <>
              Reminder: <strong>ABDULSALAM Abdulwasiu</strong> has invited you to
              a meeting
            </>
          ),
          time: "14 hours ago",
        },
        {
          text: (
            <>
              <strong>GABRIEL Samaila</strong> has invited you to a meeting for
              Sets and Number System - MATH 101
            </>
          ),
          time: "15 hours ago",
        },
        {
          text: (
            <>
              Reminder: <strong>GABRIEL Samaila</strong> has invited you to a
              meeting
            </>
          ),
          time: "15 hours ago",
        },
      ],
    },

    {
      date: "August 17th 2026",
      notifications: [
        {
          text: (
            <>
              <strong>DANJUMA Dauda</strong> has started PHYS111 meeting
            </>
          ),
          time: "2 days ago",
        },
        {
          text: (
            <>
              <strong>GABRIEL Samaila</strong> has started MTH 101 Lectures
              meeting
            </>
          ),
          time: "2 days ago",
        },
        {
          text: (
            <>
              You have a new quiz: <strong>"maths 101 quiz"</strong> in Sets and
              Number System - MATH 101 course
            </>
          ),
          time: "2 days ago",
        },
        {
          text: (
            <>
              <strong>GABRIEL Samaila</strong> has invited you to a meeting for
              Sets and Number System - MATH 101
            </>
          ),
          time: "2 days ago",
        },
        {
          text: (
            <>
              Reminder: <strong>GABRIEL Samaila</strong> has invited you to a
              meeting
            </>
          ),
          time: "2 days ago",
        },
      ],
    },

    {
      date: "August 15th 2026",
      notifications: [
        {
          text: (
            <>
              <strong>SAFIYA Umar</strong> has started Microsoft Excel meeting
            </>
          ),
          time: "3 days ago",
        },
      ],
    },

    {
      date: "August 14th 2026",
      notifications: [
        {
          text: (
            <>
              You have a New Group Discussion <strong>"FRM3"</strong> in
              Mechanics - PHYS 111 course
            </>
          ),
          time: "5 days ago",
        },
        {
          text: (
            <>
              <strong>DANJUMA Dauda</strong> has invited you to a group
              discussion
            </>
          ),
          time: "5 days ago",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#333]">
      {/* PAGE CONTENT */}
      <div className="px-6 md:px-8 pt-7 pb-16">
        {/* PAGE TITLE */}
        <h1 className="text-[18px] font-medium text-[#333] mb-4">
          Notifications
        </h1>

        {/* BREADCRUMB */}
        <div className="h-[38px] border border-[#e5e5e5] bg-white flex items-center px-3 text-[12px] text-[#999]">
          <Home size={13} className="mr-3 text-[#888]" />
          <span>Notification</span>
        </div>

        {/* ACTIVITY STREAM */}
        <div className="mt-9 w-full">
          <div className="max-w-[900px] mx-auto">
            {/* ACTIVITY STREAM HEADER */}
            <div className="border border-[#e5e5e5] bg-white h-[42px] flex items-center px-5">
              <Wrench
                size={17}
                strokeWidth={2.5}
                className="mr-2 text-[#222]"
              />

              <span className="text-[13px] font-semibold text-[#333]">
                Activity Stream
              </span>
            </div>

            {/* ACTIVITY LIST */}
            <div className="mt-3">
              {notificationGroups.map((group, groupIndex) => (
                <div
                  key={group.date}
                  className={`relative ${
                    groupIndex !== 0 ? "mt-4" : ""
                  }`}
                >
                  {/* DATE LABEL */}
                  <div className="relative z-10 inline-flex">
                    <div className="bg-[#252525] text-white text-[10px] font-semibold px-5 py-[6px] min-w-[105px] text-center">
                      {group.date}
                    </div>

                    {/* TRIANGLE UNDER DATE */}
                    <div
                      className="
                        absolute
                        left-[18px]
                        top-full
                        w-0
                        h-0
                        border-t-[8px]
                        border-t-[#252525]
                        border-r-[8px]
                        border-r-transparent
                      "
                    />
                  </div>

                  {/* NOTIFICATION BOX */}
                  <div className="border border-[#e8e8e8] bg-white mt-[-1px]">
                    {group.notifications.map((notification, index) => (
                      <div
                        key={index}
                        className="
                          min-h-[34px]
                          px-7
                          py-[7px]
                          flex
                          items-center
                          justify-between
                          gap-5
                          border-b
                          border-[#eeeeee]
                          last:border-b-0
                        "
                      >
                        <div className="text-[11px] leading-[18px] text-[#555]">
                          {notification.text}
                        </div>

                        <span className="text-[9px] text-[#999] whitespace-nowrap">
                          {notification.time}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT SIDE VERTICAL ACTION MENU */}
        <div
          className="
            hidden
            lg:flex
            fixed
            right-[8%]
            top-[54%]
            -translate-y-1/2
            flex-col
            bg-[#292929]
            rounded-[2px]
            overflow-hidden
            shadow-md
          "
        >
          <button
            type="button"
            className="
              w-[27px]
              h-[31px]
              flex
              items-center
              justify-center
              text-white
              border-b
              border-[#555]
              hover:bg-[#3b3b3b]
              transition
            "
          >
            <Bell size={12} />
          </button>

          <button
            type="button"
            className="
              w-[27px]
              h-[31px]
              flex
              items-center
              justify-center
              text-white
              border-b
              border-[#555]
              hover:bg-[#3b3b3b]
              transition
            "
          >
            <Wrench size={12} />
          </button>

          <button
            type="button"
            className="
              w-[27px]
              h-[31px]
              flex
              items-center
              justify-center
              text-white
              border-b
              border-[#555]
              hover:bg-[#3b3b3b]
              transition
            "
          >
            <MoreVertical size={13} />
          </button>

          <button
            type="button"
            className="
              w-[27px]
              h-[31px]
              flex
              items-center
              justify-center
              text-white
              hover:bg-[#3b3b3b]
              transition
            "
          >
            <MoreVertical size={13} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentNotification;