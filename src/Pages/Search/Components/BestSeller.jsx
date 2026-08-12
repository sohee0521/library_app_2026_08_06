import { getAladinBooks } from "../../../Api/bookApi";
import { useState, useEffect } from "react";
import Loading from "../../../Components/Loading";
import { Link } from "react-router-dom";

const GENRES = [
  { id: 0, name: "전체" },
  { id: 1, name: "소설/시" },
  { id: 55890, name: "에세이" },
  { id: 336, name: "자기계발" },
  { id: 170, name: "인문학" },
  { id: 987, name: "과학" },
  { id: 1196, name: "여행" },
  { id: 74, name: "역사" },
];

export default function BestSeller() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState(0);

  useEffect(() => {
    const getBestSeller = async () => {
      try {
        setLoading(true);

        const data = await getAladinBooks("Bestseller", selectedGenre);
        setBooks(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    getBestSeller();
  }, [selectedGenre]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="space-y-[30px] max-h-[700px]  overflow-y-auto  [::-webkit-scrollbar]:hidden [scrollbar-width:none] ">
      <h1 className="mt-[10px]">Best Seller</h1>
      <div className="flex gap-[10px] overflow-x-auto  [::-webkit-scrollbar]:hidden [scrollbar-width:none]">
        {GENRES.map((genre) => {
          const isSelected = selectedGenre === genre.id;

          return (
            <h5
              key={genre.id}
              onClick={() => setSelectedGenre(genre.id)}
              className={`border-[1px] rounded-full px-[15px] py-[8px] cursor-pointer whitespace-nowrap transition-colors ${
                isSelected
                  ? "bg-[var(--main-blue)] text-white "
                  : "border-[var(--gray)] text-[var(--dark-gray)]  bg-white"
              }`}
            >
              {/* whitespace-nowrap : 텍스트 내부요소 줄바꿈 안함 */}
              {genre.name}
            </h5>
          );
        })}
      </div>

      <div className="flex flex-col gap-[15px]   ">
        {books.map((book, index) => {
          const coverImg = book.cover;
          const title = book.title;
          const author = book.author;

          const bookId = book.itemId || book.isbn13 || index;

          return (
            <Link to={`/detail/${bookId}`} key={bookId}>
              <div key={bookId} className="flex gap-[15px]">
                {/* 순위*/}
                <h2 className="w-[24px] ">{index + 1}</h2>

                {/* 책정보 */}
                <div className="w-full flex gap-[10px]">
                  <div className="w-[70px] h-[90px] bg-gray-200 rounded overflow-hidden shrink-0 ">
                    <img
                      src={coverImg}
                      alt={title}
                      className="w-[70px] h-[90px] object-cover"
                    />
                  </div>

                  <div className="p-[5px] flex flex-col gap-[2px] ">
                    <h5 className=" line-clamp-2">{title}</h5>
                    <h6 className="text-[var(--dark-gray)]  line-clamp-1">
                      {author}
                    </h6>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
