import { Link } from "react-router-dom";
import error_img from "../Img/error_img.jpg";

export default function ErrorPage() {
  return (
    <div className="max-w-md min-h-screen  mx-auto px-[25px] flex flex-col justify-center items-center text-center space-y-[10px] pb-[70px]">
      {/* Error Illustration */}
      <div className="w-[320px] flex justify-center items-center">
        <img
          src={error_img}
          alt="404 Error"
          className="w-full h-full object-contain pointer-events-none select-none"
        />
      </div>

      <div className="space-y-[10px]">
        <h2 className=" text-[var(--black,#111)]">Page Not Found</h2>
        <p className=" text-[var(--dark-gray,#666)] ">
          찾으시려는 페이지가 존재하지 않거나 이동되었습니다
        </p>
      </div>

      <div className="w-full pt-[10px]">
        <Link
          to="/"
          className="block w-full select-none outline-none -webkit-tap-highlight-color-transparent"
        >
          <button
            type="button"
            className="w-full h-[50px] bg-[var(--main-blue,#007AFF)] text-white rounded-[8px] font-medium text-[16px] shadow-sm active:scale-95 active:brightness-95 transition-all duration-150 ease-out cursor-pointer"
          >
            <h4>Go Home</h4>
          </button>
        </Link>
      </div>
    </div>
  );
}
