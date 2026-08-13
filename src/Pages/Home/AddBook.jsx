import { ChevronLeft, SearchCheck, Check, Calendar } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { searchAladinBooks, getAladinBookDetail } from "../../Api/bookApi";

export default function AddBook() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [since, setSince] = useState("");
  const [until, setUntil] = useState("");
  const [memoText, setMemoText] = useState("");

  const [searchResults, setSearchResults] = useState([]); // 검색된 책 목록
  const [selectedBook, setSelectedBook] = useState(null); // 선택된 책 데이터 객체

  // ★ 저장 버튼을 클릭했는지 여부 기록
  const [submitted, setSubmitted] = useState(false);

  const [errors, setErrors] = useState({
    title: "",
    date: "",
  });

  // 검색 기능
  useEffect(() => {
    if (!title.trim() || selectedBook) {
      setSearchResults([]);
      return;
    }

    searchAladinBooks(title).then((results) => {
      setSearchResults(results || []);
    });
  }, [title, selectedBook]);

  // 책 선택
  const handleSelectBook = (book) => {
    setSelectedBook(book);
    setTitle(book.title);
    setSearchResults([]);
  };

  // 저장 (저장 버튼 클릭시에만 유효성 검사 실행)
  const handleSave = async (e) => {
    e.preventDefault();

    // ★ 저장 시도 상태 전환
    setSubmitted(true);

    // ★ 저장 버튼 누를 때 유효성 검사
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

    // 에러가 존재하면 저장 중단
    if (newErrors.title || newErrors.date) return;

    // 다 읽은 날짜(until) 유무에 따라 상태 자동 결정
    const calculatedStatus = until.trim() ? "completed" : "reading";

    // 알라딘 API 데이터 확정
    let targetBook = selectedBook;

    if (!targetBook && title.trim()) {
      try {
        const results = await searchAladinBooks(title);
        if (results && results.length > 0) {
          targetBook = results[0];
        }
      } catch (error) {
        console.error("API 검색 실패:", error);
      }
    }

    let finalBookApiData = targetBook || { title };

    // 쪽수 가져오기
    const targetItemId =
      targetBook?.itemId || targetBook?.isbn13 || targetBook?.isbn;
    if (targetItemId) {
      try {
        const detailData = await getAladinBookDetail(targetItemId);
        if (detailData) {
          finalBookApiData = {
            ...targetBook,
            ...detailData,
            itemPage:
              detailData.subInfo?.itemPage ||
              detailData.itemPage ||
              targetBook.subInfo?.itemPage,
          };
        }
      } catch (error) {
        console.error("상세 정보 가져오기 실패:", error);
      }
    }

    // 새 책 정보 저장 객체 생성
    const newBook = {
      id: Date.now(),
      status: calculatedStatus,
      bookApi: finalBookApiData,
      itemPage:
        finalBookApiData.itemPage || finalBookApiData.subInfo?.itemPage || 250,
      readDate: since,
      completedDate: until || null,
      dates: {
        since,
        until: until || null,
      },
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
    const updatedBooks = [...existingBooks, newBook];
    localStorage.setItem("myBooks", JSON.stringify(updatedBooks));

    alert("저장되었습니다!");

    if (calculatedStatus === "completed") {
      navigate("/", { state: { tab: "completed" } });
    } else {
      navigate("/", { state: { tab: "reading" } });
    }
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
                setTitle(e.target.value);
                if (selectedBook) setSelectedBook(null);
              }}
              placeholder="제목을 검색하세요"
              className={`w-full outline-none bg-transparent  ${
                title ? "text-[var(--black)]" : "text-[var(--dark-gray)]"
              }`}
            />
          </div>
          {/* 저장 버튼 클릭 시에만 에러 메시지 출력 */}
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

          {/* 검색결과 */}
          {searchResults.length > 0 && (
            <div className="max-h-[250px] overflow-y-auto bg-white border border-[var(--gray)] rounded-[5px] shadow-md divide-y divide-[var(--gray)] z-10">
              {searchResults.map((book) => (
                <div
                  key={book.itemId}
                  onClick={() => handleSelectBook(book)}
                  className="p-[10px] flex gap-[15px] items-center hover:bg-gray-100 cursor-pointer transition-colors"
                >
                  <img
                    src={book.cover}
                    alt={book.title}
                    className="w-[45px] h-[60px] object-cover rounded-[1px] flex-shrink-0 bg-gray-100"
                  />
                  <div className="flex flex-col gap-1 overflow-hidden">
                    <h5 className="font-bold text-[var(--black)] truncate">
                      {book.title}
                    </h5>
                    <h6 className="text-[var(--dark-gray)] truncate">
                      {book.author}
                    </h6>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 날짜 입력 */}
        <div className="flex flex-col gap-[10px]">
          <div className="flex items-center gap-1">
            <h4 className="!font-bold">언제 읽으셨나요?</h4>
          </div>
          <div className="w-full h-[45px] flex gap-[10px] items-center text-[var(--dark-gray)]">
            {/* 1. 시작일 선택 */}
            <div className="w-full outline-none transition-all focus-within:ring-2 focus-within:ring-[var(--main-blue)] rounded-[5px]">
              <label
                htmlFor="since-date"
                onClick={() =>
                  document.getElementById("since-date")?.showPicker()
                }
                className="w-full h-[45px] flex items-center bg-[var(--light-gray)] px-[10px] rounded-[5px] cursor-pointer "
              >
                <div className="flex w-full justify-between items-center">
                  <h5
                    className={`${
                      since
                        ? "text-[var(--black)]"
                        : "text-[#c7c7c7] !font-light"
                    }`}
                  >
                    {since || "since"}
                  </h5>
                  <Calendar size={20} strokeWidth={1.9} />
                </div>
              </label>
              <input
                id="since-date"
                type="date"
                value={since}
                onChange={(e) => setSince(e.target.value)}
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
                    {until || "until (선택)"}
                  </h5>
                  <Calendar size={20} strokeWidth={1.9} />
                </div>
              </label>
              <input
                id="until-date"
                type="date"
                value={until}
                onChange={(e) => setUntil(e.target.value)}
                className="sr-only"
              />
            </div>
          </div>
          {/* 저장 버튼 클릭 시에만 에러 메시지 출력 */}
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
              onChange={(e) => setMemoText(e.target.value)}
              rows={6}
              placeholder="책을 읽고 오늘의 감상평을 적어보세요"
              className={`w-full outline-none resize-none bg-[var(--light-gray)] ${
                memoText ? "text-[var(--black)]" : "text-[var(--dark-gray)]"
              }`}
            />
          </div>
        </div>

        {/* 저장 버튼 (클릭 자체는 상시 가능하도록 disabled 제거) */}
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
