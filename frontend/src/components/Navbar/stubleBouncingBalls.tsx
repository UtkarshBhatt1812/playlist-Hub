const SubtleFloatingBalls = () => {
  const balls = [
    { color: "bg-orange-200", opacity: "opacity-10" },
    { color: "bg-rose-200", opacity: "opacity-30" },
    { color: "bg-stone-200", opacity: "opacity-50" },
    { color: "bg-teal-200", opacity: "opacity-70" },
    { color: "bg-blue-200", opacity: "opacity-90" },
  ];

  return (
    <div className="
  absolute
  left-[50vw] 
  sm:left-[53vw]
  md:left-[55vw]
  lg:left-[62vw]
  xl:left-[65vw]
  flex items-center justify-center gap-3
  p-6 sm:p-8 md:p-10 lg:p-12
  rounded-xl
">

      {balls.map((ball, index) => (
        <div
          key={index}
          className={`
            w-3 h-3 rounded-full
            ${ball.color} ${ball.opacity}
            shadow-md animate-float
          `}
          style={{
            animationDelay: `${index * 0.2}s`,
          }}
        />
      ))}

      <style >{`
        @keyframes float {
          0% {
            transform: translateY(10px);
            height: 0px;
            display: none;
          }
          50% {
            transform: translateY(-6px);
            height: 12px;
            display: block;
          }
          100% {
            transform: translateY(10px);
            height: 0px;
            display: none;
          }
        }

        .animate-float {
          animation: float 1.8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default SubtleFloatingBalls;
