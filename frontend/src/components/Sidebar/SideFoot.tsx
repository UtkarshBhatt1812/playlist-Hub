
const ProCard: React.FC = () => {
  return (
    <div className="flex cursor-default flex-col gap-2">
      <p className="font-headingText text-accentText text-lg font-medium">Upgrade to Pro</p>
      <p className="text-secondaryText font-smtext text-[10px] leading-4 font-extralight tracking-wider">Enjoy ad-free listening with early access and personalized recommendations</p>
      <button className="hover:bg-accentText font-headingText hover:text-white w-fit rounded-full p-2 text-xs font-light text-accentText opacity-80 hover:scale-105 bg-white hover:font-medium">Upgrade</button>
    </div>
  );
};
const SideFoot: React.FC = () => {
  return (
    <div className=" flex w-[90%] flex-col gap-4 rounded-[40px] border border-white/40 bg-linear-to-br from-[#b8aaff]/80 via-[#e4defa]/90 via-1% to-white/80 to-95% px-4 py-6 mt-15 shadow-xs shadow-[#b8aaff]/20 backdrop-blur-xl  ">
      <ProCard></ProCard>
    </div>
  );
};

export default SideFoot;