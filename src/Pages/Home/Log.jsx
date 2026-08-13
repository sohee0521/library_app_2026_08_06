import { useEffect, useState } from "react";
import { ChevronLeft, Trash } from "lucide-react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Completed from "./Components/Completed";

export default function Log() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [memoInput, setMemoInput] = useState(""); // 입력 중인 메모 텍스트
  const [memoList, setMemoList] = useState([]); // 메모 목록 배열 [{ id, content, date }]

  console.log(book);

  useEffect(() => {
    const savedBooks = JSON.parse(localStorage.getItem("myBooks")) || [];

    // 2. URL의 id에서 특수문자(:) 제거 및 숫자만 추출
    const cleanUrlId = String(id).replace(/[^0-9]/g, "");

    // 3. 로컬스토리지의 id 숫자만 뽑아서 비교
    const foundBook = savedBooks.find((item) => {
      const cleanItemId = String(item.id).replace(/[^0-9]/g, "");
      return cleanItemId === cleanUrlId;
    });

    if (foundBook) {
      setBook(foundBook);

      if (Array.isArray(foundBook.memos)) {
        setMemoList(foundBook.memos);
      } else if (foundBook.memo) {
        // 기존 단일 memo 문자열이 있던 경우 변환 처리
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

  const handleDeleteBook = () => {
    if (!window.confirm("정말 이 기록을 삭제하시겠습니까?")) return;

    const savedBooks = JSON.parse(localStorage.getItem("myBooks")) || [];
    const cleanUrlId = String(id).replace(/[^0-9]/g, "");

    // 해당 책을 제외한 목록으로 로컬스토리지 업데이트
    const updatedBooks = savedBooks.filter((item) => {
      const cleanItemId = String(item.id).replace(/[^0-9]/g, "");
      return cleanItemId !== cleanUrlId;
    });

    localStorage.setItem("myBooks", JSON.stringify(updatedBooks));
    alert("삭제되었습니다.");

    // 삭제 후 이전 화면(홈/완독/읽는중 목록)으로 이동
    navigate(-1);
  };

  const handleAddMemo = (e) => {
    e.preventDefault();
    if (!memoInput.trim()) return; // 빈 값 방지

    const today = new Date();
    const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

    const newMemo = {
      id: Date.now(),
      content: memoInput,
      date: formattedDate,
    };

    // 최신 메모가 맨 위로
    const updatedMemos = [newMemo, ...memoList];
    setMemoList(updatedMemos);
    setMemoInput(""); // 입력창 초기화

    // 로컬스토리지 업데이트
    const savedBooks = JSON.parse(localStorage.getItem("myBooks")) || [];
    const updatedBooks = savedBooks.map((item) => {
      const cleanItemId = String(item.id).replace(/[^0-9]/g, "");
      const cleanUrlId = String(id).replace(/[^0-9]/g, "");

      if (cleanItemId === cleanUrlId) {
        return { ...item, memos: updatedMemos };
      }
      return item;
    });

    localStorage.setItem("myBooks", JSON.stringify(updatedBooks));
  };
  // 완독 처리 함수
  const handleCompleteBook = () => {
    const savedBooks = JSON.parse(localStorage.getItem("myBooks")) || [];
    const cleanUrlId = String(id).replace(/[^0-9]/g, "");

    const today = new Date();
    const completedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

    const updatedBooks = savedBooks.map((item) => {
      const cleanItemId = String(item.id).replace(/[^0-9]/g, "");
      if (cleanItemId === cleanUrlId) {
        return {
          ...item,
          status: "completed", // 읽는 중 -> 완독으로 상태 변경
          completedDate: completedDate, // 완독 시점 날짜 기록
          dates: {
            ...item.dates,
            until: completedDate, // dates.until 항목에 기록
          },
        };
      }
      return item;
    });

    // 로컬스토리지에 저장 및 현재 state 갱신
    localStorage.setItem("myBooks", JSON.stringify(updatedBooks));
    setBook((prev) => ({
      ...prev,
      status: "completed",
      completedDate,
      dates: { ...prev.dates, until: completedDate },
    }));

    navigate("/", { state: { tab: "completed" } });
  };

  const title = book.bookApi?.title;
  const author = book.bookApi?.author || "작가 미상";
  const coverImg = book.bookApi?.cover;

  const isCompleted = book.status === "completed";

  // 날짜 가공 (읽는중 or 완독)
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
      <div className="flex flex-col gap-[15px]">
        <h4>제목</h4>
        <div className="flex gap-[10px]">
          <div className="w-[100px] h-[135px] flex-shrink-0  bg-amber-100">
            <img
              src={coverImg}
              alt=""
              className="w-full h-full object-cover "
            />
          </div>
          <div className="flex flex-col  justify-between py-[5px]">
            <div>
              <h4>{title}</h4>
              <h5 className="text-[var(--dark-gray)]">{author}</h5>
            </div>
            <div className="w-[full] flex justify-between items-center">
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
            <button type="submit">
              <h5 className="text-[var(--main-blue)]">저장</h5>
            </button>
          </div>
        </form>

        <div className="flex flex-col gap-[15px] mb-[15px] max-h-[280px] overflow-y-auto ">
          {memoList.length > 0 ? (
            memoList.map((memo) => (
              <div
                key={memo.id}
                className="flex flex-col justify-between p-[10px] rounded-[2px] border-[1px] border-[var(--gray)] "
              >
                <p className="">{memo.content}</p>
                <h6 className="text-right text-[var(--dark-gray)] mt-[10px]">
                  {memo.date}
                </h6>
              </div>
            ))
          ) : (
            <h5 className="text-center  text-[var(--dark-gray)]">
              아직 작성된 메모가 없습니다.
            </h5>
          )}
        </div>
      </div>
      <button
        type="button"
        onClick={handleCompleteBook}
        disabled={isCompleted}
        className={`w-full h-[45px] rounded-[5px] text-white transition-all duration-150 ${
          isCompleted ? "none" : "bg-[var(--main-blue)] active:scale-[0.99]"
        }`}
      >
        <h4>완독</h4>
      </button>
    </div>
  );
}
