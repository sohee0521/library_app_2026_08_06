import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SearchCheck } from "lucide-react";
import { searchAladinBooks } from "../../Api/bookApi";
import BestSeller from "./Components/BestSeller";

export default function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const navigate = useNavigate();

  // 검색어 입력 시  API 호출
  const handleSearchChange = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    // 공백 입력시
    if (query.trim() === "") {
      setSearchResults([]);
      return;
    }

    try {
      setIsSearching(true);
      const results = await searchAladinBooks(query);
      setSearchResults(results || []);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSearching(false);
    }
  };

  // 검색창 닫기 (배경 클릭 시)
  const handleCloseSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
  };

  const isSearchActive = searchQuery.trim() !== "";

  return (
    <div className="max-w-md min-h-screen mx-auto px-[25px] pt-[40px] space-y-[30px] pb-[100px] relative">
      {/*  검색시 배경 */}
      {isSearchActive && (
        <div
          onClick={handleCloseSearch}
          className="fixed inset-0 bg-black/30 z-10 transition-opacity"
        />
      )}

      {/* 검색창 영역 */}
      <div className="relative z-20">
        <div className="w-full h-[45px] rounded-full flex justify-between items-center px-[20px] bg-[var(--light-gray)] text-[var(--dark-gray)] ">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="검색어를 입력하세요"
            className="w-full outline-none bg-transparent"
          />
          {/* <button type="button">
            <SearchCheck size={28} strokeWidth={1.5} color={"#1a1a1a"} />
          </button> */}
        </div>

        {/* 검색 결과 창 */}
        {isSearchActive && (
          <div className="absolute top-0 mt-[60px] left-0 right-0 max-h-[360px] overflow-y-auto bg-white border-[1px] border-[var(--dark-gray)] rounded-[5px] shadow-md divide-y divide-[var(--light-gray)] z-20 [::-webkit-scrollbar]:hidden [scrollbar-width:none] ">
            {isSearching ? (
              <h6 className="p-[15px] text-center text-[var(--dark-gray)]">
                검색 중입니다...
              </h6>
            ) : searchResults.length > 0 ? (
              searchResults.map((book) => {
                const bookId = book.itemId || book.isbn13;
                const title = book.title;
                const author = book.author || "작가 미상";
                const coverImg = book.cover;

                return (
                  <div
                    key={bookId}
                    onClick={() => {
                      navigate(`/detail/${bookId}`);
                      handleCloseSearch();
                    }}
                    className="p-[7px] flex gap-[10px]  hover:bg-[#f2fcff]  cursor-pointer transition-colors"
                  >
                    {/* 책 표지 */}
                    <div className="w-[60px] h-[80px]  flex-shrink-0 rounded-[2px] overflow-hidden">
                      {coverImg ? (
                        <img
                          src={coverImg}
                          alt={title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400">
                          No Image
                        </div>
                      )}
                    </div>

                    {/* 책 제목 및 작가 */}
                    <div className="flex flex-col gap-[2px] p-[5px] overflow-hidden">
                      <h5 className="font-bold text-[var(--black)] text-sm truncate">
                        {title}
                      </h5>
                      <h6 className="text-[var(--dark-gray)] text-xs truncate">
                        {author}
                      </h6>
                    </div>
                  </div>
                );
              })
            ) : (
              <h6 className="py-[20px] text-center text-[var(--dark-gray)]">
                검색 결과가 없습니다.
              </h6>
            )}
          </div>
        )}
      </div>

      <BestSeller />
    </div>
  );
}
