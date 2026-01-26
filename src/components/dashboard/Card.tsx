import React from "react";
import { useNavigate } from "react-router-dom";

// Card Props Interface
interface CardProps {
  title: string;
  imageSrc: string;
  bgColor: string;
  textColor: string;
  isEmergency?: boolean;
  link: string;
}

const Card: React.FC<CardProps> = ({
  title,
  imageSrc,
  bgColor,
  textColor,
  isEmergency,
  link,
}) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(link)}
      className={`${bgColor} ${textColor} rounded-xl p-8 flex flex-col items-center justify-between cursor-pointer transition-all duration-300 hover:scale-[0.97] hover:shadow-2xl border border-white/5 active:scale-95`}
    >
      <div className="mt-10">
        <img
          src={imageSrc}
          alt={title}
          className={`w-28 object-contain ${
            isEmergency ? "animate-pulse" : "opacity-90"
          }`}
        />
      </div>
      <span
        className={`text-[18px] font-black uppercase tracking-tighter text-center mb-4`}
      >
        {title}
      </span>
    </div>
  );
};

export default Card;
