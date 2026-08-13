import { ChevronLeft, Heart } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAladinBookDetail } from "../../api/bookApi";
import Loading from "../../components/Loading";

const getSavedBooks = () => {
  try {
    const saved = localStorage.getItem("myBooks");
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

// 해당 책이 위시리스트 항목과 일치하는지 확인
const isSameWishBook = (savedBook, targetId) =>
  String(savedBook.id) === String(targetId) && savedBook.status === "wish";

export default function Detail() {
  const { id } = useParams();

  const [state, setState] = useState({
    book: null,
    isLoading: true,
    isLiked: false,
  });

  useEffect(() => {
    if (!id) return;

    const fetchBookData = async () => {
      setState((prev) => ({ ...prev, isLoading: true }));
      try {
        const detailData = await getAladinBookDetail(id);
        const savedBooks = getSavedBooks();

        const isWish = savedBooks.some((savedBook) =>
          isSameWishBook(savedBook, id),
        );
        // some:조건에 만족하는 요소가 하나라도 있는지

        setState({
          book: detailData,
          isLoading: false,
          isLiked: isWish,
        });
      } catch (error) {
        console.error("책 상세 정보를 불러오는 중 오류 발생:", error);
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    };

    fetchBookData();
  }, [id]);

  const toggleLike = () => {
    if (!state.book) return;

    const savedBooks = getSavedBooks();
    const { isLiked, book } = state;

    //찜 해제/추가 처리
    const updatedBooks = isLiked
      ? savedBooks.filter((savedBook) => !isSameWishBook(savedBook, id))
      : [
          ...savedBooks,
          {
            id,
            title: book.title,
            author: book.author,
            cover: book.cover,
            status: "wish",
          },
        ];

    localStorage.setItem("myBooks", JSON.stringify(updatedBooks));
    setState((prev) => ({ ...prev, isLiked: !prev.isLiked }));
  };

  const { book, isLoading, isLiked } = state;

  if (isLoading) return <Loading />;

  if (!book) {
    return (
      <div className="max-w-md min-h-screen mx-auto px-[25px] pt-[40px] text-center text-[var(--dark-gray)]">
        책 정보를 찾을 수 없습니다.
      </div>
    );
  }

  const {
    title,
    author,
    cover,
    categoryName,
    customerReviewRank,
    pubDate,
    subInfo,
    description,
  } = book;

  const genre = categoryName ? categoryName.split(">").pop() : "기타";
  const rating = customerReviewRank ?? "0.0";

  return (
    <div className="max-w-md min-h-screen mx-auto px-[25px] pt-[40px] space-y-[40px]">
      <div className="flex gap-[5px] items-center">
        <Link to={-1}>
          <ChevronLeft size={28} strokeWidth={1.5} color="var(--dark-gray)" />
        </Link>
        <h3>책 정보</h3>
      </div>

      <div className="flex flex-col w-full justify-center items-center gap-[12px]">
        {/* 커버 이미지 & 좋아요 버튼 */}
        <div className="relative w-[160px] h-[210px] bg-black/10 rounded-md overflow-hidden flex justify-center items-center">
          {cover ? (
            <img
              src={cover}
              alt={title}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-sm text-gray-400">이미지 없음</span>
          )}
          <button
            onClick={toggleLike}
            className="absolute w-[28px] h-[28px] flex justify-center items-center rounded-full right-[10px] top-[10px] bg-white/75 shadow-sm active:scale-85 active:bg-white transition-all duration-150 cursor-pointer select-none"
          >
            <Heart
              size={20}
              color="var(--dark-gray)"
              strokeWidth={isLiked ? 0 : 1.5}
              fill={isLiked ? "#FF0040" : "none"}
              className={`transition-all duration-200 ease-out ${
                isLiked ? "scale-110" : "scale-100"
              }`}
            />
          </button>
        </div>

        {/* 제목 & 저자 */}
        <div className="flex flex-col items-center gap-[2px]">
          <h4 className="w-[200px] line-clamp-2 text-center break-all font-semibold">
            {title}
          </h4>
          <h5 className="text-[var(--dark-gray)] text-sm">{author}</h5>
        </div>

        {/* 장르 */}
        <div className="flex gap-[10px]">
          <h5 className="px-[8px] py-[4px] border-[1px] border-[var(--main-blue)] text-[var(--main-blue)] rounded-full text-xs">
            #{genre}
          </h5>
        </div>

        {/* 평점, 출간일, 쪽수 */}
        <div className="flex justify-center items-center text-[var(--dark-gray)] gap-[10px] text-sm">
          <div className="flex justify-center items-center gap-[2px]">
            <span className="text-amber-300">★</span> <h5>{rating}</h5>
          </div>
          <div className="w-[1px] h-[15px] bg-[var(--gray)]"></div>
          <h5>{pubDate}</h5>
          {subInfo?.itemPage && (
            <>
              <div className="w-[1px] h-[15px] bg-[var(--gray)]"></div>
              <h5>{subInfo.itemPage}쪽</h5>
            </>
          )}
        </div>
      </div>

      <div className="w-full h-[1.5px] bg-[var(--light-gray)]"></div>

      {/* 책 소개 */}
      <div className="w-full space-y-[15px] pb-[40px]">
        <h3 className="font-semibold text-lg">책 소개</h3>
        <p className="text-[var(--dark-gray)] leading-relaxed whitespace-pre-wrap">
          {description || "등록된 책 소개 정보가 없습니다."}
        </p>
      </div>
    </div>
  );
}
