import shelf from "../../../Img/shelf.png";
import cat from "../../../Img/cat.png";
import add_btn from "../../../Img/add_btn.png";
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

  const TOTAL_SHELVES = 4;
  const SHELF_CAPACITY = 3;

  // 책들을 3개씩 배열로 쪼개기
  const shelvesData = Array.from({ length: TOTAL_SHELVES }, (_, shelfIndex) => {
    const startIndex = shelfIndex * SHELF_CAPACITY;
    return books.slice(startIndex, startIndex + SHELF_CAPACITY);
  });

  return (
    <div className="h-full relative">
      <div className="flex flex-col gap-[100px] justify-center items-center mt-[120px] mb-auto pb-[100px]">
        {/* 4개의 선반을 순회 */}
        {shelvesData.map((shelfBooks, shelfIndex) => (
          <div
            key={shelfIndex}
            className="w-[340px] flex flex-col justify-center items-center relative"
          >
            {/* 📚 선반 위에 올려질 책 3권 영역 */}
            <div className="absolute bottom-[38px] left-[25px] px-[20px] flex items-end justify-start gap-[20px] z-10">
              {shelfBooks.map((book) => (
                <div
                  key={book.id}
                  className="w-[65px] h-[95px] shadow-md hover:scale-105 transition-transform flex-shrink-0"
                >
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
              ))}
            </div>

            <img src={shelf} alt="선반" className="w-full relative z-0" />
          </div>
        ))}

        <div className="absolute right-[36px] bottom-[120px]">
          <img src={cat} alt="고양이" />
        </div>

        <Link to={"/addBook"} className="absolute right-0 bottom-[90px] z-20">
          <button className="w-[52px] h-[52px] flex justify-center items-center bg-[var(--black)] rounded-full hover:opacity-90 transition-opacity">
            <img src={add_btn} alt="추가" />
          </button>
        </Link>
      </div>
    </div>
  );
}
