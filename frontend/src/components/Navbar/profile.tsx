import { User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { logoutUser } from "@/features/auth/authThunks";
import { logout } from "@/features/auth/authSlice";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
const Profile: React.FC = () => {
  const dispatch = useAppDispatch();
  const authState = useAppSelector((state : any) => state.auth);
  const navigate = useNavigate();
  const logoutHandler = async ()=>{
    dispatch(logout());// local state update
    const res = await dispatch(logoutUser());
    setOpen(prev => !prev)
      navigate("/login");
  }
  const loginHandler =  ()=>{
    navigate("/login");
    setOpen(prev => !prev)
  }
  const [open, setOpen] = useState(false);

  const handleOnClick: React.MouseEventHandler<HTMLDivElement> = () => {
    setOpen((prev) => !prev);
  };

  return (
    <div className="relative">

      <div

        className="flex h-10 w-10 items-center justify-center rounded-full border bg-white hover:cursor-pointer"
        onClick={handleOnClick}
      >
        <User className="h-6 w-6 text-neutral-500" />
      </div>


      {open && (
        <div className="absolute z-2 right-0 mt-2 w-40 rounded-lg border bg-white shadow-lg p-3">
         {
          authState.user.isAuthenticated ?
          <>
          <p className="text-sm hover:bg-gray-100 p-2 rounded cursor-pointer" onClick={()=>{navigate({ pathname: `/profile/${authState.user.id}` })
        setOpen(prev => !prev)}}>
        
            Profile
          </p>
          {/* todo: add settings page and link it here */}
          {/* <p className="text-sm hover:bg-gray-100 p-2 rounded cursor-pointer">
            Settings
          </p> */}
          <p className="text-sm hover:bg-gray-100 p-2 rounded cursor-pointer text-red-500" onClick={logoutHandler}>
            Logout
          </p>
         </> : <p className="text-sm hover:bg-gray-100 p-2 rounded cursor-pointer text-red-500" onClick={()=>loginHandler()}>
            Login
          </p>

         }
        </div>
      )}
    </div>
  );
};

export default Profile;