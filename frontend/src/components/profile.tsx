import { User } from "lucide-react";
const Profile: React.FC = () => {
  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-full border bg-white hover:cursor-pointer">
      <User className="h-6 w-6 text-neutral-500" />
    </div>
  );
};
export default Profile;