import { Heart } from "lucide-react";
import { useState } from "react";

export default function Wish() {
  const [isLiked, setIsLiked] = useState(false);

  const toggleLike = () => {
    setIsLiked((prev) => !prev);
  };
  return (
    <div className="flex justify-center mt-[30px]">
      <div className=" w-[320px] flex flex-wrap gap-[20px]">
        <div className="flex flex-col w-[150px] gap-0.5">
          <div className="relative w-[150px] h-[180px] bg-black/10">
            {/* img */}
            <button
              onClick={toggleLike}
              className="absolute w-[24px] h-[24px] flex justify-center items-center rounded-full  right-[5px] top-[5px] bg-white "
            >
              <Heart
                size={16}
                color="var(--dark-gray)"
                strokeWidth={isLiked ? 0 : 1.5}
                fill={isLiked ? "#FF4D4D" : "none"}
              />
            </button>
          </div>
          <div className="flex flex-col ">
            <h5 className="w-full line-clamp-2 break-all h-[32px]">
              책박스 폭을 꽉 채우고 글자 단위로 잘라 빈 여백을 최소화합니다.
            </h5>
            <h6 className="text-[var(--dark-gray)]">저자</h6>
          </div>
        </div>
      </div>
    </div>
  );
}
