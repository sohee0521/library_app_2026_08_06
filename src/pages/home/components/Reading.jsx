import shelf from "../../../Img/shelf.png";
import cat from "../../../Img/cat.png";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Reading() {
  const [books, setBooks] = useState([]);

  // 로컬스토리지에서 reading 책 가져오기
  useEffect(() => {
    const savedReadingBook = localStorage.getItem("myBooks");
    if (savedReadingBook) {
      const parsedBooks = JSON.parse(savedReadingBook);
      const readingBooks = parsedBooks.filter(
        (book) => book.status === "reading",
      );
      setBooks(readingBooks);
    }
  }, []);

  const TOTAL_SHELVES = 3;
  const SHELF_CAPACITY = 3;

  // 책들을 3개씩 배열로 쪼개기
  const shelvesData = Array.from({ length: TOTAL_SHELVES }, (_, shelfIndex) => {
    const startIndex = shelfIndex * SHELF_CAPACITY;
    return books.slice(startIndex, startIndex + SHELF_CAPACITY);
  });

  return (
    <div className=" relative">
      <div className="flex flex-col  gap-[140px] justify-center items-center mt-[150px] mb-auto">
        {/* 4개의 선반을 순회 */}
        {shelvesData.map((shelfBooks, shelfIndex) => (
          <div
            key={shelfIndex}
            className="w-full flex flex-col justify-center items-center relative"
          >
            {/* 선반 위에 올려질 책 영역 */}
            <div className="absolute bottom-[45px]  px-[20px] flex items-end justify-start gap-[15px] z-10">
              {shelfBooks.map((book) => (
                <Link
                  to={`/log/${book.id}`}
                  key={book.id}
                  className="group outline-none select-none"
                >
                  <div className="w-[95px] h-[130px] shadow-md transition-all duration-150 ease-out active:scale-95 active:-translate-y-1.5 active:shadow-xl active:brightness-95">
                    {book.bookApi?.cover ? (
                      <img
                        src={book.bookApi.cover}
                        alt={book.bookApi.title}
                        className="w-full h-full object-cover rounded-[2px]"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-300 flex items-center justify-center text-xs">
                        {book.bookApi?.title || book.title}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>

            <div className="w-full">
              <img
                src={shelf}
                alt="선반"
                className="w-full h-[45px]  relative z-0"
              />
            </div>
          </div>
        ))}

        <div className="absolute right-[36px] bottom-[26px]">
          <img src={cat} alt="고양이" />
        </div>
      </div>
    </div>
  );
}
