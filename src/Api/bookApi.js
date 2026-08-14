import axios from "axios";

const TTB_KEY = import.meta.env.VITE_ALADIN_TTB_KEY || "ttbqkrthgml21821151001";

const fetchAladinApi = async (endpoint, customParams = {}) => {
  try {
    // 1. 알라딘 API 실제 원본 전체 주소 구성
    const targetUrl = `http://www.aladin.co.kr/ttb/api/${endpoint}`;

    // 2. 환경별 URL 생성
    // - 로컬 개발(npm run dev): Vite 프록시(/api/aladin) 사용
    // - 배포 환경(GitHub Pages): corsproxy.io 우회 서비스 사용
    const url = import.meta.env.DEV
      ? `/api/aladin/${endpoint}`
      : `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`;

    const response = await axios.get(url, {
      params: {
        ttbkey: TTB_KEY,
        Output: "js",
        Version: "20131101",
        OptResult: "fileFormat,ebookList,packing",
        ...customParams,
      },
    });

    return response.data;
  } catch (error) {
    console.error(`[Aladin API Error] ${endpoint}:`, error);
    return null;
  }
};
// 베스트셀러
export const getAladinBooks = async (
  queryType = "Bestseller",
  categoryId = 0,
) => {
  const data = await fetchAladinApi("ItemList.aspx", {
    QueryType: queryType,
    CategoryId: categoryId,
    MaxResults: 20,
    start: 1,
    SearchTarget: "Book",
  });

  const items = data?.item || [];
  console.log(`[알라딘 리스트 - ${queryType}] 결과:`, items);
  return items;
};

// 도서 키워드 검색하기

export const searchAladinBooks = async (query) => {
  if (!query || !query.trim()) return [];

  const trimmedQuery = query.trim();

  // 1차 검색: 원본 검색어로 API 요청
  const data = await fetchAladinApi("ItemSearch.aspx", {
    Query: trimmedQuery,
    QueryType: "Title",
    MaxResults: 20,
    SearchTarget: "Book",
  });

  let items = data?.item || [];

  // 2차 검색 :결과가 없고, 검색어에 공백이 없으며, 2글자 이상인 경우
  if (
    items.length === 0 &&
    !trimmedQuery.includes(" ") &&
    trimmedQuery.length >= 2
  ) {
    const spacedQuery = trimmedQuery.split("").join(" ");

    const fallbackData = await fetchAladinApi("ItemSearch.aspx", {
      Query: spacedQuery,
      QueryType: "Title",
      MaxResults: 20,
      SearchTarget: "Book",
    });

    items = fallbackData?.item || [];
  } else {
  }

  return items;
};

// 도서 ID로 상세 정보 가져오기

export const getAladinBookDetail = async (itemId, itemIdType = "ItemId") => {
  if (!itemId) return null;

  const data = await fetchAladinApi("ItemLookUp.aspx", {
    ItemId: itemId,
    ItemIdType: itemIdType,
  });

  const bookDetail = data?.item?.[0] || null;
  console.log(`[알라딘 상세조회 - ID: ${itemId}] 결과:`, bookDetail);
  return bookDetail;
};

// // 테스트
// (async () => {
//   console.log(" 알라딘 공통 API 테스트 실행 중...");

//   // 리스트 테스트
//   await getAladinBooks("Bestseller");

//   // 검색 후 첫 번째 책 상세 정보까지 연쇄 조회 테스트
//   const searchResults = await searchAladinBooks("모순");
//   if (searchResults.length > 0) {
//     await getAladinBookDetail(searchResults[0].itemId);
//   }
// })();
