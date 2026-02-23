import { use } from "react";
import { useNavigate } from "react-router-dom";

import {useAppSelector }from "@/hooks/useAppSelector";

const ProCard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAppSelector((state ) => state.auth);
  // const [loading, setLoading] = useState(false);

  // const isPro = user?.role === "pro"/'admin';
  const isPro = false; // Placeholder until backend support is implemented
  // const [loading, setLoading] = useState(false);
  const handleUpgrade = async () => {
    // if (isPro) return;

    // setLoading(true);
alert("Upgrade feature is currently unavailable. Please check back later.");

    // setTimeout(() => {
    //   setLoading(false);
    //   navigate("/upgrade");
    // }, 800);
  };

  return (
    <div className="flex cursor-default flex-col gap-2">

      <p className="font-headingText text-accentText text-lg font-medium">
        {isPro ? "You're a Pro User " : "Upgrade to Pro"}
      </p>

      <p className="text-secondaryText font-smtext text-[10px] leading-4 font-extralight tracking-wider">
        {isPro
          ? "Enjoy your premium experience."
          : "Enjoy ad-free listening with early access and personalized recommendations"}
      </p>

      <button
        onClick={handleUpgrade}
        // disabled={isPro || false}
        className={`
          w-fit rounded-full p-2 text-xs
          font-headingText
          transition-all duration-300
          ${
            isPro
              ? "bg-green-100 text-green-600 cursor-not-allowed"
              : "bg-white text-accentText hover:bg-accentText hover:text-white hover:scale-105"
          }
        `}
      >
        {/* {loading ? "Processing..." : isPro ? "Active" : "Upgrade"} */}
      </button>

    </div>
  );
};

const SideFoot: React.FC = () => {
  return (
    <div
      className="
        flex w-[90%] flex-col gap-4
        rounded-[40px]
        border border-white/40
        bg-gradient-to-br
        from-[#b8aaff]/80
        via-[#e4defa]/90
        to-white/80
        px-4 py-6 mt-15
        shadow-xs shadow-[#b8aaff]/20
        backdrop-blur-xl
      "
    >
      <ProCard />
    </div>
  );
};

export default SideFoot;
