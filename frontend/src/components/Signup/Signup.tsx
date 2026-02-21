import React, { useState } from "react";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";

const SignupPage: React.FC = () => {
    
    
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    function toggleVisibility() {
        setIsPasswordVisible((prev) => !prev);
    }
    const [password, setPassword] = useState("");
    const Icon = isPasswordVisible ? EyeOff : Eye;

  const getStrength = () => {
  let score = 0;


  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;


  if (/[a-z]/.test(password)) score += 1;      
  if (/[A-Z]/.test(password)) score += 1;      
  if (/[0-9]/.test(password)) score += 1;     
  if (/[^A-Za-z0-9]/.test(password)) score += 1; 

  if (score <= 2) return "Weak";
  if (score <= 4) return "Fair";
  if (score <= 5) return "Strong";
  return "Very Strong";
};


  return (
    <div className="
      min-h-screen
      bg-gradient-to-br
      from-[#efe9ff]
      via-[#f6f3ff]
      to-[#e8f6ff]
      flex flex-col
    ">


      <header className="flex justify-between items-center px-10 py-4 mb-4 bg-white/60 shadow-md ">
        <h1 className="text-3xl font-bold font-headingText  text-primaryText">
          PlaylistHub
        </h1>

        <div className="flex items-center gap-4 " >
          <span className="text-sm text-secondaryText">
            Already a member?
          </span>

          <Link to={'login'} className="
            px-5 py-2 rounded-full
            border border-accentText
            text-accentText
            hover:bg-accentText hover:text-white hover:cursor-pointer
            transition-all duration-300
          ">
            Log in
          </Link>
        </div>
      </header>


      <div className="flex flex-1 items-center justify-center relative px-6">


        <div className="
          w-full max-w-md
          bg-white/60 backdrop-blur-2xl
          border border-white/40
          rounded-3xl
          shadow-2xl
          p-10
        ">

          <h2 className="text-3xl font-bold text-primaryText font-headingText ">
            Join the Hub 
          </h2>

          <p className="text-sm text-secondaryText mt-2 mb-8 font-smtext tracking-wide">
            Curate, share, and discover your next favorite track
            with our global community.
          </p>

          <div className="flex flex-col gap-5">
            <div className="relative">
              <User size={18} className="absolute left-4 top-3 text-secondaryText" />
              <input
                placeholder="music_enthusiast"
                className="
                  w-full pl-12 pr-4 py-3
                  rounded-xl
                  bg-white/70
                  border border-white/50
                  outline-none
                  text-sm
                "
              />
            </div>

            <div className="relative">
              <Mail size={18} className="absolute left-4 top-3 text-secondaryText" />
              <input
                placeholder="hello@example.com"
                className="
                  w-full pl-12 pr-4 py-3
                  rounded-xl
                  bg-white/70
                  border border-white/50
                  outline-none
                  text-sm
                "
              />
            </div>


            <div className="relative">
              <Lock size={18} className="absolute left-4 top-3 text-secondaryText" />
              <input
                type={isPasswordVisible ? "text" : "password"}
                placeholder="Min. 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="
                  w-full pl-12 pr-10 py-3
                  rounded-xl
                  bg-white/70
                  border border-white/50
                  outline-none
                  text-sm
                "
              />
              {
                <Icon
  size={18}
  onClick={toggleVisibility}
  className="absolute right-4 top-3 text-secondaryText cursor-pointer transition-opacity hover:opacity-70"
/>
              }
            </div>


            <div className="mt-2">
              <div className="h-1 rounded-full bg-neutral-200 overflow-hidden">
                <div
                  className="
                    h-full bg-gradient-to-r
                    from-accentText
                    to-purple-700
                    transition-all duration-300
                  "
                  style={{ width: `${Math.min(password.length * 10, 100)}%` }}
                />
              </div>

              <div className="flex justify-between text-xs mt-2">
                <span className="text-accentText font-medium">
                  {getStrength()}
                </span>
                <span className="text-secondaryText">
                  Avoid common words
                </span>
              </div>
            </div>


            <button
  className="
    mt-6 py-3 rounded-full
    bg-gradient-to-r
    from-accentText
    to-purple-700
    text-white font-medium
    shadow-lg
    transition-all duration-300

    hover:scale-105

    disabled:from-secondaryText
disabled:to-secondaryText
    disabled:text-white/80
    disabled:cursor-not-allowed
    disabled:hover:scale-100
  "
  disabled={password.length < 8}
>
  Create Account
</button>



            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-neutral-300" />
              <span className="text-xs text-secondaryText">
                OR CONNECT WITH
              </span>
              <div className="flex-1 h-px bg-neutral-300" />
            </div>

            
            <div className="flex gap-4">
              <button
  className="
    flex items-center justify-center gap-1
    flex-1 py-3 rounded-xl
    bg-white/60 backdrop-blur-md border border-white/40
    shadow-lg
    hover:shadow-md
    hover:shadow-[#20d660]
    hover:-translate-y-0.5
    transition-all duration-300 cursor-pointer
  "
>

  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className="w-5 h-5"
    fill="#1DB954"
  >
    <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 
    12-5.37 12-12S18.63 0 12 0zm5.48 
    17.4a.75.75 0 01-1.03.25c-2.83-1.73-6.4-2.12-10.6-1.16a.75.75 
    0 11-.33-1.46c4.6-1.05 8.58-.61 
    11.67 1.31.36.22.47.7.29 1.06zm1.47-3.27a.94.94 
    0 01-1.29.31c-3.24-1.99-8.17-2.57-12-1.42a.94.94 
    0 11-.55-1.8c4.33-1.32 9.73-.68 
    13.59 1.63.45.27.59.86.25 
    1.28zm.13-3.4c-3.89-2.31-10.3-2.53-14-.95a1.12 
    1.12 0 11-.87-2.06c4.3-1.8 11.48-1.45 
    16.02 1.19a1.12 1.12 0 11-1.15 
    1.82z" />
  </svg>

  <span className="text-sm font-medium text-primaryText">
     Spotify
  </span>
</button>
<button
  className="
    flex items-center justify-center gap-1
    flex-1 py-3 rounded-xl

     bg-white/60 backdrop-blur-md border border-white/40
    shadow-lg
    hover:shadow-md
    hover:shadow-[#ea4335]
    hover:-translate-y-0.5
    transition-all duration-300 cursor-pointer
  "
>

  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 48"
    className="w-5 h-5"
  >
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.68 1.22 9.17 
    3.6l6.86-6.86C35.88 2.06 30.39 0 
    24 0 14.62 0 6.51 5.38 2.69 
    13.22l7.99 6.2C12.43 13.12 17.7 
    9.5 24 9.5z" />
    <path fill="#4285F4" d="M46.5 24.5c0-1.63-.15-3.2-.43-4.72H24v9.02h12.67c-.55 
    2.97-2.19 5.48-4.68 
    7.18l7.2 5.59c4.2-3.87 
    6.61-9.57 6.61-16.07z" />
    <path fill="#FBBC05" d="M10.68 28.42A14.44 14.44 
    0 019.5 24c0-1.54.27-3.03.75-4.42l-7.99-6.2A23.94 
    23.94 0 000 24c0 3.8.91 7.39 2.69 
    10.78l7.99-6.36z" />
    <path fill="#34A853" d="M24 48c6.39 0 11.75-2.11 
    15.66-5.73l-7.2-5.59c-2 1.35-4.57 
    2.15-8.46 2.15-6.3 
    0-11.57-3.62-13.32-8.92l-7.99 
    6.36C6.51 42.62 14.62 48 24 48z" />
  </svg>

  <span className="text-sm font-medium text-primaryText">
     Google
  </span>
</button>

            </div>


            <p className="text-xs text-center mt-6 text-secondaryText font-smtext tracking-wide">
              By clicking "Create Account", you agree to our{" "}
              <span className="text-accentText cursor-pointer font-smtext tracking-wide">
                Terms of Service
              </span>{" "}
              and{" "}
              <span className="text-accentText cursor-pointer font-smtext tracking-wide">
                Privacy Policy
              </span>.
            </p>

          </div>
        </div>


      

      </div>


      
    </div>
  );
};

export default SignupPage;
