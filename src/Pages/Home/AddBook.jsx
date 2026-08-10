import { ChevronLeft, SearchCheck, Check } from "lucide-react";
import { useState, useEffect } from "react";
import Search from "../Search/Search";
import { Link, useNavigate } from "react-router-dom";
import { searchAladinBooks } from "../../Api/bookApi";

export default function AddBook() {
  const navigate = useNavigate();
  const [status, setStatus] = useState("reading"); //reading,finished,wish로 구분

  const [title, setTitle] = useState("");
  const [selectedBookApi, setSelectedBookApi] = useState(null); // API로 검색하여 선택된 책 객체
  const [since, setSince] = useState("");
  const [until, setUntil] = useState("");
  const [memoText, setMemoText] = useState("");

  const [searchResults, setSearchResults] = useState([]); // 검색된 책 목록
  const [selectedBook, setSelectedBook] = useState(null); // 선택된 책 데이터 객체

  const [errors, setErrors] = useState({
    title: "",
    date: "",
  });

  //유효성 검사

  useEffect(() => {
    const newErrors = { title: "", date: "" };

    if (!title.trim()) {
      newErrors.title = "제목을 입력해 주세요.";
    }

    if (!since || !until) {
      newErrors.date = "날짜를 입력해 주세요.";
    } else if (new Date(since) > new Date(until)) {
      newErrors.date = "시작일은 종료일보다 같거나 이전이어야 합니다.";
    }

    setErrors(newErrors);
  }, [title, since, until]);

  useEffect(() => {
    if (!title.trim() || selectedBook) {
      setSearchResults([]);
      return;
    }

    searchAladinBooks(title).then((results) => {
      setSearchResults(results || []);
    });
  }, [title, selectedBook]);

  //책 검색
  const handleSelectBook = (book) => {
    setSelectedBook(book); // 클릭한 책 객체 저장
    setTitle(book.title); // 제목 인풋 값 변경
    setSearchResults([]); // 검색목록 닫기
  };

  // 저장
  const handleSave = async (e) => {
    e.preventDefault();

    if (errors.title || errors.date) return;

    // 알라딘 API 데이터 확정
    let finalBookApiData = null;

    if (selectedBook) {
      //목록에서 선택한 경우
      finalBookApiData = selectedBook;
    } else {
      // 직접 제목 타이핑한 경우 -> API에서 검색해서 첫번째 결과 가져오기
      try {
        const searchResults = await searchAladinBooks(title);
        if (searchResults && searchResults.length > 0) {
          finalBookApiData = searchResults[0]; // 가장 연관성 높은 첫 번째 책
        } else {
          // 검색 결과 없을 경우 기본 제목만 저장
          finalBookApiData = { title };
        }
      } catch (error) {
        console.error(" API 조회 실패:", error);
        finalBookApiData = { title };
      }
    }

    //새 책 정보 저장할 객체 생성
    const newBook = {
      id: Date.now(),
      status: status,
      bookApi: selectedBook || { title }, // ✨ 선택한 알라딘 책 객체(cover 포함) 저장!
      dates: {
        since,
        until,
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
    navigate(-1);
  };

  // 저장된책정보 콘솔
  useEffect(() => {
    const savedData = localStorage.getItem("myBooks");

    if (savedData) {
      const parsedBooks = JSON.parse(savedData);

      console.log("🔄 새로고침 - 로컬스토리지 전체 데이터:");

      console.log(parsedBooks);
    } else {
      console.log("📭 새로고침 - 저장된 데이터가 없습니다.");
    }
  }, []);

  //------------------------ html,css---------------------------------------
  return (
    <div className="max-w-md min-h-screen mx-auto px-[25px] pt-[50px] space-y-[40px]">
      <div className="flex gap-[15px] items-center">
        <Link to={-1}>
          <ChevronLeft size={28} strokeWidth={1.5} color="var(--dark-gray)" />
        </Link>
        <h3>책 추가</h3>
      </div>
      <form onSubmit={handleSave} className="flex flex-col gap-[40px] ">
        <div className="flex flex-col gap-[15px]">
          <h4>제목</h4>
          <div className="w-full h-[45px] flex justify-between items-center px-[10px] bg-[var(--light-gray)] text-[var(--dark-gray)] ">
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                // 사용자가 제목을 다시 수정하면 기존 선택 정보를 해제
                if (selectedBook) setSelectedBook(null);
              }}
              placeholder="검색어를 입력하세요"
              className={`w-full outline-none bg-transparent ${
                title ? "text-[var(--black)]" : "text-[var(--dark-gray)]"
              }`}
            />
            <button>
              <SearchCheck size={28} strokeWidth={1.5} />
            </button>
          </div>
          {errors.title && (
            <h6 className="text-xs text-red-500 font-medium pl-1">
              {errors.title}
            </h6>
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
                <h6 className=" text-gray-600 truncate">
                  {/*truncate: 일정 길이에서 자르고 끝에 ...을 붙이는 처리 */}

                  {selectedBook.author}
                </h6>
              </div>
            </div>
          )}

          {/* 검색결과 */}
          {searchResults.length > 0 && (
            <div className="max-h-[250px] overflow-y-auto bg-white border border-[var(--gray)] rounded-[5px] shadow-md divide-y divide-[var(--gray)]  z-10">
              {/* overflow-y: auto: 넘칠 때만 스크롤바가 생김 , divide-y: 구분선 생김*/}

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
                    <h5 className=" font-bold text-[var(--black) truncate">
                      {book.title}
                    </h5>
                    <h6 className=" text-[var(--dark-gray)] truncate">
                      {book.author}
                    </h6>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="flex flex-col gap-[15px]">
          <h4>날짜</h4>
          <div className="w-full h-[45px] flex gap-[10px] items-center text-[var(--dark-gray)] ">
            <input
              type="date"
              value={since}
              onChange={(e) => setSince(e.target.value)}
              placeholder="since"
              className={`w-full h-[45px] outline-none bg-[var(--light-gray)] px-[10px] rounded-[5px] cursor-pointer ${
                since ? "text-[var(--black)] " : "text-[var(--dark-gray)]"
              }`}
            />
            <input
              type="date"
              value={until}
              onChange={(e) => setUntil(e.target.value)}
              placeholder="until"
              className={`w-full h-[45px] outline-none bg-[var(--light-gray)] px-[10px] rounded-[5px] cursor-pointer ${
                until ? "text-[var(--black)] " : "text-[var(--dark-gray)]"
              }`}
            />
          </div>
          {errors.date && (
            <h6 className=" text-red-500 font-medium pl-1">{errors.date}</h6>
          )}
        </div>
        <div className="flex flex-col gap-[15px]">
          <h4>메모</h4>
          <div className="w-full min-h-[150px] flex items-start px-[10px] pt-[15px] bg-[var(--light-gray)] text-[var(--dark-gray)] ">
            <textarea
              value={memoText}
              onChange={(e) => setMemoText(e.target.value)}
              rows={6}
              placeholder="책을 읽고 오늘의 감상평을 적어보세요 (선택)"
              className={`w-full outline-none resize-none bg-[var(--light-gray)] ${
                memoText ? "text-[var(--black)]" : "text-[var(--dark-gray)]"
              }`}
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={
            !title.trim() ||
            !since ||
            !until ||
            new Date(since) > new Date(until)
          }
          className={`w-full h-[45px] rounded-[5px] text-white transition-all duration-150 ${
            title.trim() && since && until && new Date(since) <= new Date(until)
              ? "bg-[var(--main-blue)] cursor-pointer hover:brightness-95 active:brightness-75 active:scale-[0.99]"
              : "bg-[var(--gray)] cursor-not-allowed "
          }`}
        >
          <h4>저장</h4>
        </button>
      </form>
    </div>
  );
}
