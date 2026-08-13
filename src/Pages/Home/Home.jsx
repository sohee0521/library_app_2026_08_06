import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getAladinBooks } from "../../Api/bookApi";
import Reading from "./Components/Reading";
import Completed from "./Components/Completed";
import Wish from "./Components/Wish";
import Loading from "../../Components/Loading";
import add_btn from "../../Img/add_btn.png";
import { Link } from "react-router-dom";
export default function Home() {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(location.state?.tab || "reading");

  useEffect(() => {
    const fetchBooks = async () => {
      const data = await getAladinBooks();
      console.log("받아온 책 데이터:", data);
    };
    fetchBooks();
  }, []);

  useEffect(() => {
    if (location.state?.tab) {
      setActiveTab(location.state.tab);
    }
  }, [location.state]);

  const linkTabContent = () => {
    switch (activeTab) {
      case "reading":
        return <Reading />;
      case "completed":
        return <Completed />;
      case "wish":
        return <Wish />;
      default:
        return <Reading />;
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="relative max-w-md min-h-screen  mx-auto px-[25px] pt-[60px] ">
      <div className="space-y-[40px]">
        <h1 className="">MY SHELF</h1>
        <div className="w-full">
          <div className="flex w-full gap-[10px] justify-between mb-[20px]">
            {/* 1. 읽는중 탭 */}
            <button
              onClick={() => setActiveTab("reading")}
              className="flex-1 select-none outline-none active:scale-95 transition-transform duration-150 ease-out cursor-pointer"
            >
              <h3
                className={`w-full h-[45px] flex justify-center items-center font-medium transition-all duration-200 ${
                  activeTab === "reading"
                    ? "border-b-[2px] border-[var(--main-blue)] text-[var(--main-blue)] font-bold"
                    : "text-[var(--dark-gray)] border-b-[2px] border-transparent"
                }`}
              >
                읽는중
              </h3>
            </button>

            {/* 2. 완독 탭 */}
            <button
              onClick={() => setActiveTab("completed")}
              className="flex-1 select-none outline-none active:scale-95 transition-transform duration-150 ease-out cursor-pointer"
            >
              <h3
                className={`w-full h-[45px] flex justify-center items-center font-medium transition-all duration-200 ${
                  activeTab === "completed"
                    ? "border-b-[2px] border-[var(--main-blue)] text-[var(--main-blue)] font-bold"
                    : "text-[var(--dark-gray)] border-b-[2px] border-transparent"
                }`}
              >
                완독
              </h3>
            </button>

            {/* 3. 위시 탭 */}
            <button
              onClick={() => setActiveTab("wish")}
              className="flex-1 select-none outline-none active:scale-95 transition-transform duration-150 ease-out cursor-pointer"
            >
              <h3
                className={`w-full h-[45px] flex justify-center items-center font-medium transition-all duration-200 ${
                  activeTab === "wish"
                    ? "border-b-[2px] border-[var(--main-blue)] text-[var(--main-blue)] font-bold"
                    : "text-[var(--dark-gray)] border-b-[2px] border-transparent"
                }`}
              >
                위시
              </h3>
            </button>
          </div>
        </div>
      </div>
      <Link
        to={"/addBook"}
        className="fixed right-[25px] bottom-[25px] z-20 mb-[70px] select-none -webkit-tap-highlight-color-transparent outline-none"
      >
        <button className="w-[52px] h-[52px] flex justify-center items-center bg-[var(--black)] rounded-full shadow-lg active:scale-85  active:shadow-sm transition-all duration-200 ease-out cursor-pointer">
          <img src={add_btn} alt="추가" />
        </button>
      </Link>
      {linkTabContent()}
    </div>
  );
}
