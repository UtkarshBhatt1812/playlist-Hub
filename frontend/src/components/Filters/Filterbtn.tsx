

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
        px-4 py-2 rounded-full text-xs font-subHeadingText
        shadow-2xl shadow-red-200
        transition-all duration-300
        cursor-pointer

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
