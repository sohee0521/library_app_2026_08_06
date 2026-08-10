import { useEffect, useState } from "react";
import { getAladinBooks } from "../../Api/bookApi";
import Reading from "./Components/Reading";
import Completed from "./Components/Completed";
import Wish from "./Components/Wish";
import Loading from "../../Components/Loading";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("reading");

  useEffect(() => {
    const fetchBooks = async () => {
      const data = await getAladinBooks();
      console.log("받아온 책 데이터:", data);
    };
    fetchBooks();
  }, []);

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
      <div className="space-y-[20px]">
        <h1 className="">MY SHELF</h1>
        <div className="w-full flex justify-center">
          <div className="flex gap-[40px]">
            <button onClick={() => setActiveTab("reading")}>
              <h3
                className={`w-[80px] h-[45px] px-[12px] flex justify-center items-center 
              ${activeTab === "reading" ? "border-b-[2px] border-[var(--main-blue)]  text-[var(--main-blue)]" : "text-[var(--gray]"}`}
              >
                읽는중
              </h3>
            </button>
            <button onClick={() => setActiveTab("completed")}>
              <h3
                className={`w-[80px] h-[45px] px-[12px] flex justify-center items-center
              ${activeTab === "completed" ? "border-b-[2px] border-[var(--main-blue)] text-[var(--main-blue)] " : "text-[var(--gray]"}`}
              >
                완독
              </h3>
            </button>
            <button onClick={() => setActiveTab("wish")}>
              <h3
                className={`w-[80px] h-[45px] px-[12px] flex justify-center items-center
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
