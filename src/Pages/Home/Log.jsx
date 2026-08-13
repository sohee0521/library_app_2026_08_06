import { useEffect, useState } from "react";
import { ChevronLeft, Trash } from "lucide-react";
import { useParams, Link, useNavigate } from "react-router-dom";

//ID에서 숫자만 추출
const cleanId = (id) => String(id).replace(/[^0-9]/g, "");

//오늘 날짜 YYYY-MM-DD 문자열 생성
const getTodayString = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

//localStorage 데이터 읽기
const getSavedBooks = () => {
  try {
    return JSON.parse(localStorage.getItem("myBooks")) || [];
  } catch {
    return [];
  }
};

// localStorage 데이터 업데이트 (특정 ID 대상 매핑)
const updateSavedBooks = (targetId, updater) => {
  const books = getSavedBooks();
  const cleanTarget = cleanId(targetId);

  const updated = books.map((book) =>
    cleanId(book.id) === cleanTarget ? updater(book) : book,
  );

  localStorage.setItem("myBooks", JSON.stringify(updated));
  return updated;
};

export default function Log() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [memoInput, setMemoInput] = useState("");
  const [memoList, setMemoList] = useState([]);

  useEffect(() => {
    const savedBooks = getSavedBooks();
    const foundBook = savedBooks.find(
      (item) => cleanId(item.id) === cleanId(id),
    );

    if (foundBook) {
      setBook(foundBook);

      if (Array.isArray(foundBook.memos)) {
        setMemoList(foundBook.memos);
      } else if (foundBook.memo) {
        setMemoList([
          {
            id: Date.now(),
            content: foundBook.memo,
            date: new Date().toLocaleDateString(),
          },
        ]);
      } else {
        setMemoList([]);
      }
    }
  }, [id]);

  if (!book) {
    return (
      <div className="max-w-md min-h-screen mx-auto px-[25px] pt-[50px] text-[var(--dark-gray)]">
        로딩 중이거나 책 정보를 찾을 수 없습니다...
      </div>
    );
  }

  // 책 삭제
  const handleDeleteBook = () => {
    if (!window.confirm("정말 이 기록을 삭제하시겠습니까?")) return;

    const savedBooks = getSavedBooks();
    const updatedBooks = savedBooks.filter(
      (item) => cleanId(item.id) !== cleanId(id),
    );

    localStorage.setItem("myBooks", JSON.stringify(updatedBooks));
    alert("삭제되었습니다.");
    navigate(-1);
  };

  // 메모 추가
  const handleAddMemo = (e) => {
    e.preventDefault();
    if (!memoInput.trim()) return;

    const newMemo = {
      id: Date.now(),
      content: memoInput.trim(),
      date: getTodayString(),
    };

    const updatedMemos = [newMemo, ...memoList];
    setMemoList(updatedMemos);
    setMemoInput("");

    // localStorage 업데이트
    updateSavedBooks(id, (targetBook) => ({
      ...targetBook,
      memos: updatedMemos,
    }));
  };

  // 완독 처리
  const handleCompleteBook = () => {
    const completedDate = getTodayString();

    updateSavedBooks(id, (targetBook) => ({
      ...targetBook,
      status: "completed",
      completedDate,
      dates: {
        ...targetBook.dates,
        until: completedDate,
      },
    }));

    setBook((prev) => ({
      ...prev,
      status: "completed",
      completedDate,
      dates: { ...prev.dates, until: completedDate },
    }));

    navigate("/", { state: { tab: "completed" } });
  };

  const { title, author = "작가 미상", cover: coverImg } = book.bookApi || {};
  const isCompleted = book.status === "completed";

  // 날짜 가공
  const sinceDate = book.dates?.since || book.readDate || "";
  const untilDate = book.dates?.until || book.completedDate;
  const displayDate =
    isCompleted && untilDate ? `${sinceDate} ~ ${untilDate}` : `${sinceDate} ~`;

  return (
    <div className="max-w-md min-h-screen mx-auto px-[25px] pt-[50px] space-y-[40px]">
      <div>
        <Link to={-1}>
          <div className="flex gap-[5px] items-center">
            <ChevronLeft size={28} strokeWidth={1.5} color="var(--dark-gray)" />
            <h3>기록</h3>
          </div>
        </Link>
      </div>

      {/* 책 정보 섹션 */}
      <div className="flex flex-col gap-[15px]">
        <h4>제목</h4>
        <div className="flex gap-[10px]">
          <div className="w-[100px] h-[135px] flex-shrink-0 bg-amber-100">
            <img
              src={coverImg}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col justify-between py-[5px] flex-1">
            <div>
              <h4>{title}</h4>
              <h5 className="text-[var(--dark-gray)]">{author}</h5>
            </div>
            <div className="w-full flex justify-between items-center">
              <h6 className="text-[var(--dark-gray)] text-sm">{displayDate}</h6>
              <button
                type="button"
                onClick={handleDeleteBook}
                className="p-1 hover:opacity-70 transition-opacity cursor-pointer"
              >
                <Trash size={16} color="var(--dark-gray)" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 메모 섹션 */}
      <div className="flex flex-col gap-[15px]">
        <h4>메모</h4>

        <form
          onSubmit={handleAddMemo}
          className="relative flex flex-col p-[10px] rounded-[5px] border-[2px] border-[var(--main-blue)] bg-white shadow-sm"
        >
          <textarea
            rows={3}
            value={memoInput}
            onChange={(e) => setMemoInput(e.target.value)}
            placeholder="오늘의 감상평을 추가해보세요."
            maxLength={100}
            className="w-full outline-none resize-none text-sm placeholder:text-[var(--dark-gray)]"
          />
          <div className="flex justify-end px-[5px]">
            <button type="submit" className="cursor-pointer">
              <h5 className="text-[var(--main-blue)] font-medium">저장</h5>
            </button>
          </div>
        </form>

        {/* 메모 리스트 */}
        <div className="flex flex-col gap-[15px] mb-[15px] max-h-[280px] overflow-y-auto">
          {memoList.length > 0 ? (
            memoList.map((memo) => (
              <div
                key={memo.id}
                className="flex flex-col justify-between p-[10px] rounded-[2px] border-[1px] border-[var(--gray)]"
              >
                <p>{memo.content}</p>
                <h6 className="text-right text-[var(--dark-gray)] mt-[10px]">
                  {memo.date}
                </h6>
              </div>
            ))
          ) : (
            <h5 className="text-center text-[var(--dark-gray)] py-4">
              아직 작성된 메모가 없습니다.
            </h5>
          )}
        </div>
      </div>

      {/* 완독 버튼 */}
      <button
        type="button"
        onClick={handleCompleteBook}
        disabled={isCompleted}
        className={`w-full h-[45px] rounded-[5px] text-white transition-all duration-150 ${
          isCompleted
            ? "hidden"
            : "bg-[var(--main-blue)] cursor-pointer active:scale-[0.99]"
        }`}
      >
        <h4>{isCompleted ? "" : "완독"}</h4>
      </button>
    </div>
  );
}
