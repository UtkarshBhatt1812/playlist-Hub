import { User } from "lucide-react";
import api from "../../services/api";


const onProfileClick = async ()=>{
  const res = await api.get('/')
  console.log(res)

}
const Profile: React.FC = () => {
  return (
    <div className="flex h-10 w-10 items-center justify-center
     rounded-full border bg-white hover:cursor-pointer " onClick={onProfileClick}>
      <User className="h-6 w-6 text-neutral-500" />
    </div>
  );
};
export default Profile;