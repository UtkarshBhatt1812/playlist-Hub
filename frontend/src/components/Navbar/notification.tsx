import { Bell } from "lucide-react";

const Notification: React.FC = () => {
  return (
    <>
      <Bell className="h-7 w-5 transition-transform duration-200 hover:scale-110 text-neutral-500 hover:cursor-pointer" />
    </>
  );
};

export default Notification;