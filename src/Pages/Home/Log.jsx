import { useEffect, useState } from "react";
import { ChevronLeft } from "lucide-react";
import { useParams, Link, useNavigate } from "react-router-dom";

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

  const title = book.bookApi?.title;
  const author = book.bookApi?.author || "작가 미상";
  const coverImg = book.bookApi?.cover;
  const readDate = book.readDate || "날짜 미지정";

  return (
    <div className="max-w-md min-h-screen mx-auto px-[25px] pt-[50px] space-y-[40px]">
      <div className="flex gap-[15px] items-center">
        <Link to={-1}>
          <ChevronLeft size={28} strokeWidth={1.5} color="var(--dark-gray)" />
        </Link>
        <h3>기록</h3>
      </div>
      <div className="flex flex-col gap-[15px]">
        <h4>제목</h4>
        <div className="flex gap-[10px]">
          <div className="w-[70px] h-[100px] bg-amber-100">
            <img
              src={coverImg}
              alt=""
              className="w-[70px] h-[100px] object-cover "
            />
          </div>
          <div className="flex flex-col justify-between py-[5px]">
            <div>
              <h4>{title}</h4>
              <h5 className="text-[var(--dark-gray)]">{author}</h5>
            </div>
            <h6 className="text-[var(--dark-gray)]">{readDate}</h6>
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
          <div className="flex justify-end mt-2">
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
    </div>
  );
}
