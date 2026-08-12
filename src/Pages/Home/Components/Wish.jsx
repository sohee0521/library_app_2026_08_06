import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Wish() {
  const [wishBooks, setWishBooks] = useState([]);

  useEffect(() => {
    const savedMyBooks = localStorage.getItem("myBooks");
    if (savedMyBooks) {
      const parsedBooks = JSON.parse(savedMyBooks);
      const wishes = parsedBooks.filter((book) => book.status === "wish");
      setWishBooks(wishes);
    }
  }, []);

  const handleRemoveWish = (id) => {
    const savedMyBooks = localStorage.getItem("myBooks");
    if (!savedMyBooks) return;

    const parsedBooks = JSON.parse(savedMyBooks);
    // myBooks 전체 데이터 중 삭제할 wish 도서만 걸러내기
    const updatedBooks = parsedBooks.filter(
      (book) => !(String(book.id) === String(id) && book.status === "wish"),
    );

    localStorage.setItem("myBooks", JSON.stringify(updatedBooks));
    // 화면 State 갱신
    setWishBooks((prev) =>
      prev.filter((book) => String(book.id) !== String(id)),
    );
  };

  if (wishBooks.length === 0) {
    return (
      <div className="flex justify-center items-center mt-[50px] text-[var(--dark-gray)]">
        찜한 도서가 없습니다.
      </div>
    );
  }

  return (
    <div className="flex justify-center mt-[20px]">
      <div className="w-full grid grid-cols-3 gap-[10px] max-h-[640px] pb-[20px] overflow-y-auto  [::-webkit-scrollbar]:hidden [scrollbar-width:none] ">
        {wishBooks.map((book) => (
          <div key={book.id} className="flex flex-col gap-[10px]">
            <div className="relative w-full h-[170px] bg-black/10 rounded-md overflow-hidden">
              <Link to={`/detail/${book.id}`}>
                {book.cover ? (
                  <img
                    src={book.cover}
                    alt={book.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex justify-center items-center text-xs text-gray-400">
                    이미지 없음
                  </div>
                )}
              </Link>
              <button
                onClick={() => handleRemoveWish(book.id)}
                className="absolute w-[28px] h-[28px] flex justify-center items-center rounded-full right-[10px] top-[10px] bg-white/75 shadow-sm shadow-sm z-10"
              >
                <Heart
                  size={20}
                  color="var(--dark-gray)"
                  strokeWidth={0}
                  fill="#FF0040"
                />
              </button>
            </div>
            <div className="flex flex-col gap-[5px]">
              <Link to={`/detail/${book.id}`}>
                <h4 className="w-full line-clamp-2 break-all h-[32px] text-sm font-medium leading-4">
                  {book.title}
                </h4>
              </Link>
              <h6 className="text-[var(--dark-gray)] text-xs truncate">
                {book.author}
              </h6>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
