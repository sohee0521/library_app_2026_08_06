import { useEffect, useState } from "react"; // 사용 중인 다른 Hook과 함께 import
import { getAladinBooks } from "../../Api/bookApi";
import Reading from "./Components/Reading";
import Loading from "../../Components/Loading";

export default function Home() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchBooks = async () => {
      const data = await getAladinBooks();
      console.log("받아온 책 데이터:", data);
    };
    fetchBooks();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className=" max-w-md min-h-screen mx-auto px-[25px] pt-[60px]">
      <div className="space-y-[20px]">
        <h1 className="">MY SHELF</h1>
        <div className="w-full flex justify-center">
          <div className="flex gap-[40px]">
            <button>
              <h3 className="w-[80px] h-[45px] px-[12px] flex justify-center items-center border-b-[2px] border-[var(--main-blue)]">
                읽는중
              </h3>
            </button>
            <button>
              <h3 className="w-[80px] h-[45px] px-[12px] flex justify-center items-center">
                완독
              </h3>
            </button>
            <button>
              <h3 className="w-[80px] h-[45px] px-[12px] flex justify-center items-center">
                위시
              </h3>
            </button>
          </div>
        </div>
      </div>
      <Reading />
    </div>
  );
}
