import { ChevronLeft, Check, Calendar } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { searchAladinBooks, getAladinBookDetail } from "../../api/bookApi";

export default function AddBook() {
  const navigate = useNavigate();

  // 1. 폼 데이터 단일 객체 관리
  const [formData, setFormData] = useState({
    title: "",
    since: "",
    until: "",
    memoText: "",
  });

  // 2. 검색 관련 상태 (로딩 상태 추가)
  const [searchState, setSearchState] = useState({
    results: [],
    selectedBook: null,
    isSearching: false,
  });

  // 3. 제출 및 에러 상태
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({ title: "", date: "" });

  const { title, since, until, memoText } = formData;
  const { results: searchResults, selectedBook, isSearching } = searchState;

  // 입력값 변경 핸들러
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // 4. 디바운스가 적용된 도서 검색 Effect
  useEffect(() => {
    const trimmedTitle = title.trim();

    // 입력값이 없거나 이미 선택된 책이 있으면 검색 결과 초기화
    if (!trimmedTitle || selectedBook) {
      setSearchState((prev) => ({ ...prev, results: [], isSearching: false }));
      return;
    }

    let isSubscribed = true;
    setSearchState((prev) => ({ ...prev, isSearching: true }));

    // 200ms 디바운스
    const timer = setTimeout(async () => {
      try {
        const results = await searchAladinBooks(trimmedTitle);
        if (isSubscribed) {
          setSearchState((prev) => ({
            ...prev,
            results: results || [],
            isSearching: false,
          }));
        }
      } catch (error) {
        console.error("도서 검색 중 오류 발생:", error);
        if (isSubscribed) {
          setSearchState((prev) => ({ ...prev, isSearching: false }));
        }
      }
    }, 200);

    return () => {
      isSubscribed = false;
      clearTimeout(timer);
    };
  }, [title, selectedBook]);

  // 책 선택
  const handleSelectBook = (book) => {
    setSearchState({ selectedBook: book, results: [], isSearching: false });
    handleInputChange("title", book.title);
  };

  // 유효성 검사
  const validateForm = () => {
    const newErrors = { title: "", date: "" };

    if (!title.trim()) {
      newErrors.title = "제목을 입력해 주세요.";
    }

    if (!since) {
      newErrors.date = "읽기 시작한 날짜를 입력해 주세요.";
    } else if (until && new Date(since) > new Date(until)) {
      newErrors.date = "시작일은 종료일보다 같거나 이전이어야 합니다.";
    }

    setErrors(newErrors);
    return !newErrors.title && !newErrors.date;
  };

  // 최종 상세 정보 수집
  const fetchFinalBookData = async () => {
    let targetBook = selectedBook;

    if (!targetBook && title.trim()) {
      try {
        const results = await searchAladinBooks(title);
        if (results?.length > 0) targetBook = results[0];
      } catch (error) {
        console.error("API 검색 실패:", error);
      }
    }

    let finalData = targetBook || { title };
    const targetItemId =
      targetBook?.itemId || targetBook?.isbn13 || targetBook?.isbn;

    if (targetItemId) {
      try {
        const detailData = await getAladinBookDetail(targetItemId);
        if (detailData) {
          finalData = {
            ...targetBook,
            ...detailData,
            itemPage:
              detailData.subInfo?.itemPage ||
              detailData.itemPage ||
              targetBook?.subInfo?.itemPage,
          };
        }
      } catch (error) {
        console.error("상세 정보 가져오기 실패:", error);
      }
    }

    return finalData;
  };

  // 저장 처리
  const handleSave = async (e) => {
    e.preventDefault();
    setSubmitted(true);

    if (!validateForm()) return;

    const calculatedStatus = until.trim() ? "completed" : "reading";
    const finalBookApiData = await fetchFinalBookData();

    const newBook = {
      id: Date.now(),
      status: calculatedStatus,
      bookApi: finalBookApiData,
      itemPage:
        finalBookApiData.itemPage || finalBookApiData.subInfo?.itemPage || 250,
      readDate: since,
      completedDate: until || null,
      dates: { since, until: until || null },
      memos: memoText.trim()
        ? [
            {
              id: Date.now(),
              date: new Date().toISOString().split("T")[0],
              content: memoText,
            },
          ]
        : [],
      createdAt: new Date().toISOString(),
    };

    const existingBooks = JSON.parse(localStorage.getItem("myBooks")) || [];
    localStorage.setItem(
      "myBooks",
      JSON.stringify([...existingBooks, newBook]),
    );

    alert("저장되었습니다!");
    navigate("/", { state: { tab: calculatedStatus } });
  };

  return (
    <div className="max-w-md min-h-screen mx-auto px-[25px] pt-[50px] space-y-[40px]">
      <div>
        <Link to={-1}>
          <div className="flex gap-[5px] items-center">
            <ChevronLeft size={28} strokeWidth={1.5} color="var(--dark-gray)" />
            <h3>책 추가</h3>
          </div>
        </Link>
      </div>

      <form onSubmit={handleSave} className="flex flex-col gap-[50px]">
        {/* 제목 입력 */}
        <div className="flex flex-col gap-[10px]">
          <h4 className="!font-bold">어떤 책을 읽으셨나요?</h4>
          <div className="w-full h-[45px] flex justify-between items-center px-[10px] bg-[var(--light-gray)] text-[var(--dark-gray)] rounded-[5px] outline-none transition-all focus-within:ring-2 focus-within:ring-[var(--main-blue)]">
            <input
              type="text"
              value={title}
              onChange={(e) => {
                handleInputChange("title", e.target.value);
                if (selectedBook)
                  setSearchState((prev) => ({ ...prev, selectedBook: null }));
              }}
              placeholder="제목을 검색하세요"
              className={`w-full outline-none bg-transparent ${
                title ? "text-[var(--black)]" : "text-[var(--dark-gray)]"
              }`}
            />
          </div>

          {submitted && errors.title && (
            <h6 className="text-[var(--main-blue)] pl-1">{errors.title}</h6>
          )}

          {/* 선택된 책 표기 */}
          {selectedBook && (
            <div className="flex items-center gap-[10px] p-[10px] bg-[#f2fcff] border border-[var(--main-blue)] rounded-[5px]">
              <img
                src={selectedBook.cover}
                alt={selectedBook.title}
                className="w-[35px] h-[48px] object-cover rounded-[3px]"
              />
              <div className="flex flex-col flex-1 overflow-hidden">
                <div className="flex items-center gap-1 text-[var(--main-blue)]">
                  <Check size={14} />
                  <h6 className="!font-medium !text-[13px]">선택됨</h6>
                </div>
                <h6 className="text-gray-600 truncate">
                  {selectedBook.author}
                </h6>
              </div>
            </div>
          )}

          {/* 검색 결과 목록 */}
          {title.trim() && !selectedBook && (
            <div className="max-h-[250px] overflow-y-auto bg-white border border-[var(--gray)] rounded-[5px] shadow-md divide-y divide-[var(--gray)] z-10 [::-webkit-scrollbar]:hidden [scrollbar-width:none]">
              {isSearching ? (
                <h6 className="p-[15px] text-center text-[var(--dark-gray)]">
                  검색 중입니다...
                </h6>
              ) : searchResults.length > 0 ? (
                searchResults.map((book) => {
                  const bookId = book.itemId || book.isbn13;
                  const {
                    title: bookTitle,
                    author = "작가 미상",
                    cover,
                  } = book;

                  return (
                    <div
                      key={bookId}
                      onClick={() => handleSelectBook(book)}
                      className="p-[10px] flex gap-[15px] items-center hover:bg-gray-100 cursor-pointer transition-colors"
                    >
                      <img
                        src={cover}
                        alt={bookTitle}
                        className="w-[45px] h-[60px] object-cover rounded-[1px] flex-shrink-0 bg-gray-100"
                      />
                      <div className="flex flex-col gap-1 overflow-hidden">
                        <h5 className="font-bold text-[var(--black)] truncate">
                          {bookTitle}
                        </h5>
                        <h6 className="text-[var(--dark-gray)] truncate">
                          {author}
                        </h6>
                      </div>
                    </div>
                  );
                })
              ) : (
                <h6 className="py-[15px] text-center text-[var(--dark-gray)]">
                  검색 결과가 없습니다.
                </h6>
              )}
            </div>
          )}
        </div>

        {/* 날짜 입력 */}
        <div className="flex flex-col gap-[10px]">
          <h4 className="!font-bold">언제 읽으셨나요?</h4>
          <div className="w-full h-[45px] flex gap-[10px] items-center text-[var(--dark-gray)]">
            {/* 1. 시작일 선택 */}
            <div className="w-full outline-none transition-all focus-within:ring-2 focus-within:ring-[var(--main-blue)] rounded-[5px]">
              <label
                htmlFor="since-date"
                onClick={() =>
                  document.getElementById("since-date")?.showPicker()
                }
                className="w-full h-[45px] flex items-center bg-[var(--light-gray)] px-[10px] rounded-[5px] cursor-pointer"
              >
                <div className="flex w-full justify-between items-center">
                  <h5
                    className={
                      since
                        ? "text-[var(--black)]"
                        : "text-[#c7c7c7] !font-light"
                    }
                  >
                    {since || "시작일"}
                  </h5>
                  <Calendar size={20} strokeWidth={1.9} />
                </div>
              </label>
              <input
                id="since-date"
                type="date"
                value={since}
                onChange={(e) => handleInputChange("since", e.target.value)}
                className="sr-only"
              />
            </div>

            <h4>~</h4>

            {/* 2. 종료일 선택 */}
            <div className="w-full outline-none transition-all focus-within:ring-2 focus-within:ring-[var(--main-blue)] rounded-[5px]">
              <label
                htmlFor="until-date"
                onClick={() =>
                  document.getElementById("until-date")?.showPicker()
                }
                className="w-full h-[45px] flex items-center bg-[var(--light-gray)] px-[10px] rounded-[5px] cursor-pointer"
              >
                <div className="flex w-full justify-between items-center">
                  <h5
                    className={`text-sm ${
                      until
                        ? "text-[var(--black)]"
                        : "text-[#c7c7c7] !font-light"
                    }`}
                  >
                    {until || "완독일 (선택)"}
                  </h5>
                  <Calendar size={20} strokeWidth={1.9} />
                </div>
              </label>
              <input
                id="until-date"
                type="date"
                value={until}
                onChange={(e) => handleInputChange("until", e.target.value)}
                className="sr-only"
              />
            </div>
          </div>

          {submitted && errors.date && (
            <h6 className="text-[var(--main-blue)] pl-1">{errors.date}</h6>
          )}
        </div>

        {/* 메모 입력 */}
        <div className="flex flex-col gap-[10px]">
          <div className="flex items-center gap-[5px]">
            <h4 className="!font-bold">어떤 점이 기억에 남나요?</h4>
            <h5 className="text-[var(--dark-gray)]">(선택)</h5>
          </div>
          <div className="w-full min-h-[150px] flex items-start px-[10px] pt-[15px] bg-[var(--light-gray)] text-[var(--dark-gray)] rounded-[5px] outline-none transition-all focus-within:ring-2 focus-within:ring-[var(--main-blue)]">
            <textarea
              value={memoText}
              onChange={(e) => handleInputChange("memoText", e.target.value)}
              rows={6}
              placeholder="책을 읽고 오늘의 감상평을 적어보세요"
              className={`w-full outline-none resize-none bg-[var(--light-gray)] ${
                memoText ? "text-[var(--black)]" : "text-[var(--dark-gray)]"
              }`}
            />
          </div>
        </div>

        {/* 저장 버튼 */}
        <button
          type="submit"
          className="w-full h-[45px] rounded-[5px] text-white bg-[var(--main-blue)] cursor-pointer hover:brightness-95 active:brightness-75 active:scale-[0.99] transition-all duration-150"
        >
          <h4>저장</h4>
        </button>
      </form>
    </div>
  );
}
