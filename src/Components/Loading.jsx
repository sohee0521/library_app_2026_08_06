import sleeping_cat from "../Img/sleeping_cat.png";
import { Audio } from "react-loader-spinner";

export default function Loading() {
  return (
    <div className="min-h-screen flex justify-center items-center ">
      <div className="flex flex-col gap-2 justify-center items-center  ">
        <div className="w-[100px]">
          <img src={sleeping_cat} alt="" />
        </div>
        <h2 className="!text-[20px]">LOADING...</h2>
        <Audio />
      </div>
    </div>
  );
}
