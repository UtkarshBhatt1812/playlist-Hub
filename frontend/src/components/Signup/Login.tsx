import React, { useState } from "react";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const LoginPage: React.FC = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div
      className="
        min-h-screen flex flex-col
        bg-gradient-to-br
        from-[#f2e9ff]
        via-[#f8f5ff]
        to-[#eef6ff]
      "
    >
      {/* Header */}
      <header className="flex justify-between items-center px-10 py-6">
        <div className="flex items-center gap-2">

          <span className="font-bold text-primaryText text-3xl font-headingText ">
            PlaylistHub
          </span>
        </div>

        
      </header>


      <div className="flex flex-1 items-center justify-center px-6">

        <div
          className="
            w-full max-w-md
            bg-white/70 backdrop-blur-xl
            border border-white/40
            shadow-2xl
            rounded-3xl
            p-10
          "
        >
          <h2 className="text-3xl font-bold text-primaryText">
            Welcome back
          </h2>

          <p className="text-sm text-secondaryText mt-2 mb-8">
            Your music journey continues here.
          </p>


          <div className="flex flex-col gap-4">


            <button
              className="
                flex items-center justify-center gap-2
                py-3 rounded-xl
                bg-white
                border border-neutral-200 
                shadow-sm
                transition-all duration-300
                hover:-translate-y-0.5
                hover:shadow-[0_8px_15px_rgba(234,67,53,0.25)]
              "
            >
              <span className="text-primaryText text-sm font-medium flex gap-2">
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
                Continue with Google
              </span>
            </button>


            <button
              className="
                flex items-center justify-center gap-2
                py-3 rounded-xl
                bg-white/70 border border-neutral-200 text-sm text-primaryText
                shadow-sm
                font-medium
                transition-all duration-300
                hover:-translate-y-0.5
                hover:shadow-[0_8px_25px_rgba(29,185,84,0.25)]
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
              Continue with Spotify
            </button>

          </div>


          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-neutral-300" />
            <span className="text-xs text-neutral-400">OR</span>
            <div className="flex-1 h-px bg-neutral-300" />
          </div>

          {/* Form */}
          <div className="flex flex-col gap-6">

            {/* Email */}
            <div>
              <label className="text-sm font-medium text-primaryText">
                Email Address
              </label>

              <div className="relative mt-2">
                <Mail size={18} className="absolute left-4 top-3 text-neutral-400" />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className="
                    w-full pl-12 pr-4 py-3
                    rounded-xl
                    bg-white
                    border border-neutral-300
                    outline-none
                    text-sm
                  "
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-primaryText">
                  Password
                </label>

                <button className="text-xs text-accentText hover:underline">
                  Forgot password?
                </button>
              </div>

              <div className="relative mt-2">
                <Lock size={18} className="absolute left-4 top-3 text-neutral-400" />
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="
                    w-full pl-12 pr-4 py-3
                    rounded-xl
                    bg-white
                    border border-neutral-300
                    outline-none
                    text-sm
                  "
                />
              </div>
            </div>


            <button
              className="
                mt-4 py-3 rounded-xl
                bg-gradient-to-r
                to-accentText/40
                from-purple-400/40
                text-white font-semibold
                hover:to-accentText/70
                hover:from-purple-400
                shadow-lg
                flex items-center justify-center gap-2
                hover:scale-105
                transition-transform duration-300
              "
            >
              Sign In <ArrowRight size={18} />
            </button>

          </div>


          <p className="text-sm text-center mt-8 text-secondaryText">
            New to PlaylistHub?{" "}
            <Link to="/signup" className="text-accentText font-medium cursor-pointer hover:underline">
              Create an account
            </Link>
          </p>

        </div>
      </div>


      <footer className="text-center text-xs text-neutral-500 py-6 flex justify-center gap-6">
        <span className="cursor-pointer hover:text-accentText">PRIVACY</span>
        <span className="cursor-pointer hover:text-accentText">TERMS</span>
        <span className="cursor-pointer hover:text-accentText">HELP</span>
      </footer>
    </div>
  );
};

export default LoginPage;
