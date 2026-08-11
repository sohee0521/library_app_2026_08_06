import { ChevronLeft, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function Detail() {
  const [isLiked, setIsLiked] = useState(false);

  const toggleLike = () => {
    setIsLiked((prev) => !prev);
  };
  return (
    <div className="max-w-md min-h-screen mx-auto px-[25px] pt-[40px] space-y-[40px]">
      <div className="flex gap-[15px] items-center">
        <Link to={-1}>
          <ChevronLeft size={28} strokeWidth={1.5} color="var(--dark-gray)" />
        </Link>
        <h3>책 정보</h3>
      </div>
      <div className="flex flex-col w-full justify-center items-center gap-[10px]">
        <div className="relative w-[200px] h-[250px] bg-black/10">
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
        <div className="flex flex-col items-center gap-[2px] ">
          <h4 className="w-[200px] line-clamp-2 text-center break-all">제목</h4>
          <h5 className="text-[var(--dark-gray)]">저자</h5>
        </div>
        <div className="flex gap-[10px]">
          <h5 className="px-[8px] py-[4px] border-[1px] border-[var(--main-blue)] text-[var(--main-blue)] rounded-full">
            #장르
          </h5>
        </div>
        <div className=" flex divide-x justify-center items-center divide-[var(--gray] text-[var(--dark-gray)]">
          <h6 className="h-[15px] px-[10px]">평점</h6>
          <h6 className="h-[15px] px-[10px]">출간일</h6>
          <h6 className="h-[15px] px-[10px]">쪽수</h6>
        </div>
      </div>
    </div>
  );
}
