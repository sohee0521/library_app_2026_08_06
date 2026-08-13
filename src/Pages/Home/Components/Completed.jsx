import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import cat from "../../../Img/cat.png";

export default function Completed() {
  const [completedBooks, setCompletedBooks] = useState([]);

  useEffect(() => {
    const savedMyBooks = localStorage.getItem("myBooks");
    if (savedMyBooks) {
      const parsedBooks = JSON.parse(savedMyBooks);
      // status가 completed인 책만 필터링
      const completed = parsedBooks.filter(
        (book) => book.status === "completed",
      );
      setCompletedBooks(completed);
    }
  }, []);

  //  통계 데이터 계산
  const totalBooksCount = completedBooks.length;

  // 전체 쪽수 계산
  const totalPages = useMemo(() => {
    return completedBooks.reduce((acc, book) => {
      const page =
        book.bookApi?.subInfo?.itemPage || book.subInfo?.itemPage || 250;
      return acc + Number(page);
    }, 0);
  }, [completedBooks]);

  // 쌓인 높이계산 (100쪽당 약 1cm로 환산, 소수점 1자리)
  const totalHeightCm = (totalPages / 100).toFixed(1);

  // 독서 기간계산: 가장 오래된 등록일) 기준
  const readingDays = useMemo(() => {
    if (completedBooks.length === 0) return 0;

    const dates = completedBooks
      .map((b) => new Date(b.completedDate || b.readDate || Date.now()))
      .filter((d) => !isNaN(d.getTime()));

    if (dates.length === 0) return 1;

    const earliestDate = new Date(Math.min(...dates));
    const today = new Date();
    const diffTime = Math.abs(today - earliestDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays === 0 ? 1 : diffDays;
  }, [completedBooks]);

  // 개별 책 스타일 가공
  const preparedBooks = useMemo(() => {
    const books = completedBooks.map((book, index) => {
      const page = Number(
        book.bookApi?.subInfo?.itemPage || book.subInfo?.itemPage || 250,
      );

      const minPage = 80;
      const maxPage = 1000;

      const clampedPage = Math.min(Math.max(page, minPage), maxPage);
      const height = 16 + ((clampedPage - minPage) / (maxPage - minPage)) * 54;

      const pseudoRandom = Math.sin(index + 1) * 10000;
      const randomOffset = (pseudoRandom - Math.floor(pseudoRandom) - 0.5) * 32;

      const title = book.bookApi?.title || book.title || "제목 없음";

      return {
        ...book,
        height,
        offsetX: randomOffset,
        title,
        page, // 콘솔 확인용 쪽수
      };
    });

    // ★ 콘솔 출력 부분 (개발자 도구에서 표 형태로 확인 가능)
    if (books.length > 0) {
      console.log("📚 --- 완독 도서 두께(px) 테스트 --- 📚");
      console.table(
        books.map((b) => ({
          제목: b.title,
          페이지수: `${b.page}쪽`,
          적용두께: `${b.height.toFixed(1)}px`,
        })),
      );
    }

    return books;
  }, [completedBooks]);
  return (
    <div className="flex flex-col items-center w-full min-h-[600px] pt-[10px] pb-[40px] select-none">
      {/* 1. 상단 문구  */}
      <div className="flex items-baseline gap-[5px] text-base font-medium text-[var(--black)] mb-[40px]">
        <h2 className="text-[var(--main-blue)]">{readingDays}</h2>
        <h3 className="text-[var(--main-blue)]">일</h3>
        <h4> 동안</h4>
        <h2 className="text-[var(--main-blue)]">{totalBooksCount}</h2>
        <h3 className="text-[var(--main-blue)]">권</h3>
        <h4>읽어서</h4>
        <h2 className="text-[var(--main-blue)]">{totalHeightCm}</h2>
        <h3 className="text-[var(--main-blue)]">cm</h3>
        <h4>가 쌓였어요</h4>
      </div>

      {/* 2. 책 쌓기 시각화 영역 */}
      <div className="relative w-full max-w-[320px] flex flex-col justify-end items-center min-h-[400px]">
        {completedBooks.length === 0 ? (
          <div className="text-center text-[var(--dark-gray)] pb-[160px]">
            아직 완독한 책이 없습니다.
          </div>
        ) : (
          <div className="relative flex flex-col-reverse items-center w-full">
            {/* 맨 위에 얹어지는 고양이 아이콘 */}
            <div className="absolute -top-[45px] right-[25%] z-20 pointer-events-none">
              <img src={cat} alt="고양이" />
            </div>

            {/* 책 리스트 */}
            {preparedBooks.map((book) => (
              <Link
                key={book.id}
                to={`/log/${book.id}`}
                className="w-full flex justify-center my-[-0.5px] group"
              >
                <div
                  style={{
                    height: `${book.height}px`,
                    transform: `translateX(${book.offsetX}px)`,
                  }}
                  className="w-[220px] max-w-[85%] border-[1.5px] border-[var(--black)] bg-white rounded-[2px] flex items-center justify-center px-3 shadow-xs hover:border-[var(--main-blue)] transition-all duration-150 cursor-pointer relative z-10"
                >
                  <span className="text-xs font-semibold text-[var(--black)] truncate text-center group-hover:text-[var(--main-blue)]">
                    {book.title}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
