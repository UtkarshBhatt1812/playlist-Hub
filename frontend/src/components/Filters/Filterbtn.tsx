

interface Props {
  label: string;
  active?: boolean;
  onClick?: () => void;
}

function Filterbtn({ label, active = false, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className={`
        px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-[10px] sm:text-xs font-subHeadingText
        shadow-md sm:shadow-2xl  h-full w-20 mt-5 ml-2
        transition-all duration-300
        cursor-pointer shrink-0 

        ${
          active
            ? "bg-accentText text-white"
            : "bg-white text-primaryText hover:bg-accentText/30 hover:text-white"
        }

        hover:scale-105 hover:-translate-y-1 active:scale-95
      `}
    >
      {label}
    </button>
  );
}

export default Filterbtn;
