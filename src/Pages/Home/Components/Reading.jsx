import shelf from "../../../Img/shelf.png";
import cat from "../../../Img/cat.png";
import add_btn from "../../../Img/add_btn.png";

export default function Reading() {
  return (
    <div className=" h-full relative ">
      <div className="flex flex-col gap-[100px] justify-center items-center mt-[120px] mb-auto">
        <div className="w-[340px] flex flex-col justify-center items-center">
          <img src={shelf} alt="" />
        </div>
        <div className="w-[340px] flex flex-col justify-center items-center">
          <img src={shelf} alt="" />
        </div>
        <div className="w-[340px] flex flex-col justify-center items-center">
          <img src={shelf} alt="" />
        </div>
        <div className="w-[340px] flex flex-col justify-center items-center">
          <img src={shelf} alt="" />
        </div>

        <div className="absolute right-[36px] bottom-[19px]">
          <img src={cat} alt="" />
        </div>
        <button className="absolute w-[52px] h-[52px] flex justify-center items-center bg-[var(--black)] rounded-full right-0 bottom-[-35px]">
          <img src={add_btn} alt="" />
        </button>
      </div>
    </div>
  );
}
