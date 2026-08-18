import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import Reading from "./components/Reading";
import Completed from "./components/Completed";
import Wish from "./components/Wish";
import add_btn from "../../Img/add_btn.png";

const TABS = [
  { id: "reading", label: "읽는중" },
  { id: "completed", label: "완독" },
  { id: "wish", label: "위시" },
];

const TAB_COMPONENTS = {
  reading: <Reading />,
  completed: <Completed />,
  wish: <Wish />,
};

export default function Home() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.state?.tab || "reading");

  // 페이지 이동으로 전달받은 탭 상태 반영
  useEffect(() => {
    if (location.state?.tab) {
      setActiveTab(location.state.tab);
    }
  }, [location.state]);

  return (
    <div className="relative max-w-md h-full  mx-auto px-[25px] pt-[60px]  ">
      <div className="space-y-[40px]">
        <h1>MY SHELF</h1>

        {/* 탭 메뉴 */}
        <div className="w-full">
          <div className="flex w-full gap-[10px] justify-between mb-[20px]">
            {TABS.map(({ id, label }) => {
              const isActive = activeTab === id;
              return (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className="flex-1 select-none outline-none active:scale-95 transition-transform duration-150 ease-out cursor-pointer"
                >
                  <h3
                    className={`w-full h-[45px] flex justify-center items-center font-medium transition-all duration-200 ${
                      isActive
                        ? "border-b-[2px] border-[var(--main-blue)] text-[var(--main-blue)] font-bold"
                        : "text-[var(--dark-gray)] border-b-[2px] border-transparent"
                    }`}
                  >
                    {label}
                  </h3>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 선택된 탭의 컨텐츠  */}
      {TAB_COMPONENTS[activeTab] || <Reading />}

      {/* 책 추가 Floating 버튼 */}
      <Link
        to="/addBook"
        className="fixed right-[25px] bottom-[25px] z-20 mb-[70px] select-none -webkit-tap-highlight-color-transparent outline-none"
      >
        <button className="w-[52px] h-[52px] flex justify-center items-center bg-[var(--black)] rounded-full shadow-lg active:scale-85 active:shadow-sm transition-all duration-200 ease-out cursor-pointer">
          <img src={add_btn} alt="추가" />
        </button>
      </Link>
    </div>
  );
}
