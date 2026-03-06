import React, { useState } from "react";
import { Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "@/features/auth/authThunks";
import { setLoading, setUser } from "@/features/auth/authSlice";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";

const MAX_ATTEMPTS = 5;
const LOCK_TIME = 60000; // 1 minute

const LoginPage: React.FC = () => {
  const loading = useAppSelector((state: any) => state.auth.loading);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);

  const [attempts, setAttempts] = useState(0);
  const [lockUntil, setLockUntil] = useState<number | null>(null);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    setPasswordError(null);
    setEmailError(null);

    if (lockUntil && Date.now() < lockUntil) {
      setPasswordError("Too many login attempts. Try again later.");
      return;
    }

    if (!form.email || !form.password) {
      setPasswordError("Email and password are required");
      return;
    }

    try {
      dispatch(setLoading(true));

      const response = await dispatch(loginUser(form));

      dispatch(
        setUser({
          id: response.user.id,
          name: response.user.username,
        }),
      );

      dispatch(setLoading(false));

      navigate("/");
    } catch (error: any) {
      dispatch(setLoading(false));

      setAttempts((prev) => prev + 1);

      if (attempts + 1 >= MAX_ATTEMPTS) {
        setLockUntil(Date.now() + LOCK_TIME);
        setPasswordError("Too many attempts. Login locked for 1 minute.");
        return;
      }

      if (error?.message?.toLowerCase().includes("email")) {
        setEmailError("Email not found");
      } else if (error?.message?.toLowerCase().includes("password")) {
        setPasswordError("Incorrect password");
      } else {
        setPasswordError("Login failed");
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordError(null);
    setEmailError(null);

    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-[#f2e9ff] via-[#f8f5ff] to-[#eef6ff]">
      <header className="flex items-center justify-between px-10 py-6">
        <div className="flex items-center gap-2">
          <span className="text-primaryText font-headingText text-3xl font-bold">PlaylistHub</span>
        </div>
      </header>

      {!loading ? (
        <div className="flex flex-1 items-center justify-center px-6">
          <div className="w-full max-w-md rounded-3xl border border-white/40 bg-white/70 p-10 shadow-2xl backdrop-blur-xl">
            <h2 className="text-primaryText text-3xl font-bold">Welcome back</h2>

            <p className="text-secondaryText mt-2 mb-8 text-sm">Your music journey continues here.</p>

            <div className="flex flex-col gap-4">
              <button className="flex items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white py-3 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_15px_rgba(234,67,53,0.25)]">
                <span className="text-primaryText flex gap-2 text-sm font-medium">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="h-5 w-5">
                    {" "}
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.68 1.22 9.17 3.6l6.86-6.86C35.88 2.06 30.39 0 24 0 14.62 0 6.51 5.38 2.69 13.22l7.99 6.2C12.43 13.12 17.7 9.5 24 9.5z" /> <path fill="#4285F4" d="M46.5 24.5c0-1.63-.15-3.2-.43-4.72H24v9.02h12.67c-.55 2.97-2.19 5.48-4.68 7.18l7.2 5.59c4.2-3.87 6.61-9.57 6.61-16.07z" /> <path fill="#FBBC05" d="M10.68 28.42A14.44 14.44 0 019.5 24c0-1.54.27-3.03.75-4.42l-7.99-6.2A23.94 23.94 0 000 24c0 3.8.91 7.39 2.69 10.78l7.99-6.36z" /> <path fill="#34A853" d="M24 48c6.39 0 11.75-2.11 15.66-5.73l-7.2-5.59c-2 1.35-4.57 2.15-8.46 2.15-6.3 0-11.57-3.62-13.32-8.92l-7.99 6.36C6.51 42.62 14.62 48 24 48z" />{" "}
                  </svg>
                  Continue with Google
                </span>
              </button>


              <button className="text-primaryText flex items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white/70 py-3 text-sm font-medium shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(29,185,84,0.25)]">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5" fill="#1DB954">
                  {" "}
                  <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.48 17.4a.75.75 0 01-1.03.25c-2.83-1.73-6.4-2.12-10.6-1.16a.75.75 0 11-.33-1.46c4.6-1.05 8.58-.61 11.67 1.31.36.22.47.7.29 1.06zm1.47-3.27a.94.94 0 01-1.29.31c-3.24-1.99-8.17-2.57-12-1.42a.94.94 0 11-.55-1.8c4.33-1.32 9.73-.68 13.59 1.63.45.27.59.86.25 1.28zm.13-3.4c-3.89-2.31-10.3-2.53-14-.95a1.12 1.12 0 11-.87-2.06c4.3-1.8 11.48-1.45 16.02 1.19a1.12 1.12 0 11-1.15 1.82z" />
                </svg>
                Continue with Spotify
              </button>
            </div>

            <div className="my-8 flex items-center gap-4">
              <div className="h-px flex-1 bg-neutral-300" />
              <span className="text-xs text-neutral-400">OR</span>
              <div className="h-px flex-1 bg-neutral-300" />
            </div>

            <form className="flex flex-col gap-6" onSubmit={handleSubmit}>

              <div>
                <label className="text-primaryText text-sm font-medium">Email Address</label>

                <div className="relative mt-2">
                  <Mail size={18} className="absolute top-3 left-4 text-neutral-400" />

                  <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="name@example.com" className="w-full rounded-xl border border-neutral-300 bg-white py-3 pr-4 pl-12 text-sm outline-none" />
                </div>

                {emailError && <p className="mt-2 text-sm text-red-500">{emailError}</p>}
              </div>


              <div>
                <label className="text-primaryText text-sm font-medium">Password</label>

                <div className="relative mt-2">
                  <Lock size={18} className="absolute top-3 left-4 text-neutral-400" />

                  <input type={passwordVisible ? "text" : "password"} name="password" value={form.password} onChange={handleChange} placeholder="••••••••" className="w-full rounded-xl border border-neutral-300 bg-white py-3 pr-12 pl-12 text-sm outline-none" />

                  <button type="button" onClick={() => setPasswordVisible((prev) => !prev)} className="absolute top-3 right-3 text-neutral-400">
                    {passwordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {passwordError && <p className="mt-2 text-sm text-red-500">{passwordError}</p>}
              </div>


              <button type="submit" disabled={loading || (lockUntil && Date.now() < lockUntil)} className="to-accentText/40 mt-4 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-400/40 py-3 font-semibold text-white shadow-lg transition-transform duration-300 hover:scale-105 disabled:opacity-50">
                {loading ? "Signing In..." : "Sign In"}
                {!loading && <ArrowRight size={18} />}
              </button>
            </form>

            <p className="text-secondaryText mt-8 text-center text-sm">
              New to PlaylistHub?{" "}
              <Link to="/signup" className="text-accentText cursor-pointer font-medium hover:underline">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-center">Loading...</div>
      )}

      <footer className="flex justify-center gap-6 py-6 text-center text-xs text-neutral-500">
        <span className="hover:text-accentText cursor-pointer">PRIVACY</span>
        <span className="hover:text-accentText cursor-pointer">TERMS</span>
        <span className="hover:text-accentText cursor-pointer">HELP</span>
      </footer>
    </div>
  );
};

export default LoginPage;
