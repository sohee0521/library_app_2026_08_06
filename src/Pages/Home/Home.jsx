import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getAladinBooks } from "../../Api/bookApi";
import Reading from "./Components/Reading";
import Completed from "./Components/Completed";
import Wish from "./Components/Wish";
import Loading from "../../Components/Loading";

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
    <div className=" max-w-md min-h-screen mx-auto px-[25px] pt-[60px]">
      <div className="space-y-[40px]">
        <h1 className="">MY SHELF</h1>
        <div className="w-full flex ">
          <div className="flex w-full gap-[30px] justify-between mb-[20px]">
            <button onClick={() => setActiveTab("reading")} className="w-[33%]">
              <h3
                className={`w-full h-[45px] px-[12px] flex justify-center items-center 
              ${activeTab === "reading" ? "border-b-[2px] border-[var(--main-blue)]  text-[var(--main-blue)]" : "text-[var(--gray]"}`}
              >
                읽는중
              </h3>
            </button>
            <button
              onClick={() => setActiveTab("completed")}
              className="w-[33%]"
            >
              <h3
                className={`w-[full h-[45px] px-[12px] flex justify-center items-center
              ${activeTab === "completed" ? "border-b-[2px] border-[var(--main-blue)] text-[var(--main-blue)] " : "text-[var(--gray]"}`}
              >
                완독
              </h3>
            </button>
            <button onClick={() => setActiveTab("wish")} className="w-[33%]">
              <h3
                className={`w-full h-[45px] px-[12px] flex justify-center items-center
              ${activeTab === "wish" ? "border-b-[2px] border-[var(--main-blue)]  text-[var(--main-blue)]" : "text-[var(--gray]"}`}
              >
                위시
              </h3>
            </button>
          </div>
        </div>
      </div>
      {linkTabContent()}
    </div>
  );
}
