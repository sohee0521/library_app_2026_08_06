import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { searchAladinBooks } from "../../api/bookApi";
import BestSeller from "./components/BestSeller";

export default function Search() {
  const navigate = useNavigate();

  const [searchState, setSearchState] = useState({
    query: "",
    results: [],
    isSearching: false,
  });

  const { query, results, isSearching } = searchState;
  const isSearchActive = query.trim() !== "";

  // 입력값 변경 핸들러
  const handleQueryChange = (e) => {
    const nextQuery = e.target.value;
    setSearchState((prev) => ({
      ...prev,
      query: nextQuery,
      results: nextQuery.trim() === "" ? [] : prev.results,
    }));
  };

  // 입력 중 연속적인 API 요청 방지
  useEffect(() => {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) return;

    let isSubscribed = true;
    setSearchState((prev) => ({ ...prev, isSearching: true }));

    const timer = setTimeout(async () => {
      try {
        const fetchResults = await searchAladinBooks(trimmedQuery);
        if (isSubscribed) {
          setSearchState((prev) => ({
            ...prev,
            results: fetchResults || [],
            isSearching: false,
          }));
        }
      } catch (error) {
        console.error("도서 검색 중 오류 발생:", error);
        if (isSubscribed) {
          setSearchState((prev) => ({ ...prev, isSearching: false }));
        }
      }
    }, 300); // 300ms 디바운스

    return () => {
      isSubscribed = false;
      clearTimeout(timer);
    };
  }, [query]);

  // 검색창 초기화/닫기
  const handleCloseSearch = () => {
    setSearchState({
      query: "",
      results: [],
      isSearching: false,
    });
  };

  // 상세 페이지 이동
  const handleSelectBook = (bookId) => {
    navigate(`/detail/${bookId}`);
    handleCloseSearch();
  };

  return (
    <div className="max-w-md mx-auto px-[25px] pt-[40px] space-y-[30px] pb-[70px] relative">
      {/* 검색 시 오버레이 배경 */}
      {isSearchActive && (
        <div
          onClick={handleCloseSearch}
          className="fixed inset-0 bg-black/30 z-10 transition-opacity"
        />
      )}

      {/* 검색 영역 */}
      <div className="relative z-20">
        <div className="w-full h-[45px] rounded-full flex justify-between items-center px-[20px] bg-[var(--light-gray)] text-[var(--dark-gray)]">
          <input
            type="text"
            value={query}
            onChange={handleQueryChange}
            placeholder="검색어를 입력하세요"
            className="w-full outline-none bg-transparent"
          />
        </div>

        {/* 검색 결과 드롭다운 */}
        {isSearchActive && (
          <div className="absolute top-0 mt-[60px] left-0 right-0 max-h-[360px] overflow-y-auto bg-white border border-[var(--gray)] rounded-[5px] shadow-md divide-y divide-[var(--light-gray)] z-20 [::-webkit-scrollbar]:hidden [scrollbar-width:none]">
            {isSearching ? (
              <h6 className="p-[15px] text-center text-[var(--dark-gray)]">
                검색 중입니다...
              </h6>
            ) : results.length > 0 ? (
              results.map((book) => {
                const bookId = book.itemId || book.isbn13;
                const { title, author = "작가 미상", cover: coverImg } = book;

                return (
                  <div
                    key={bookId}
                    onClick={() => handleSelectBook(bookId)}
                    className="p-[7px] flex gap-[10px] hover:bg-[#f2fcff] cursor-pointer transition-colors"
                  >
                    {/* 책 표지 */}
                    <div className="w-[60px] h-[80px] flex-shrink-0 rounded-[2px] overflow-hidden bg-gray-100">
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
