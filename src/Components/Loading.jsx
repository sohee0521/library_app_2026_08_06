import sleeping_cat from "../Img/sleeping_cat.png";
import { RotatingLines } from "react-loader-spinner";

export default function Loading() {
  return (
    <div className="min-h-screen flex justify-center items-center ">
      <div className="flex flex-col gap-5 mb-[80px] justify-center items-center  ">
        {/* <div className="w-[100px]">
          <img src={sleeping_cat} alt="" />
        </div> */}

        <RotatingLines
          height={60}
          width={60}
          color="#2ad1ff"
          secondaryColor="##2ad1ff"
          animationDuration="1.25"
        />
        <h2 className="!text-[28px]">LOADING...</h2>
      </div>
    </div>
  );
}
