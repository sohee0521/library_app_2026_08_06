import axios from "axios";

const TTB_KEY = import.meta.env.VITE_ALADIN_TTB_KEY;

const fetchAladinApi = async (endpoint, customParams = {}) => {
  try {
    const response = await axios.get(`/api/aladin/${endpoint}`, {
      params: {
        ttbkey: TTB_KEY,
        Output: "js",
        Version: "20131101",
        OptResult: "fileFormat,ebookList,packing", // 쪽수, 전자책, 포장정보 기본 포함
        ...customParams, // 각 API 요청별 변하는 파라미터
      },
    });

    let data = response.data;

    return data;
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
  if (!query) return [];

  const data = await fetchAladinApi("ItemSearch.aspx", {
    Query: query,
    QueryType: "Title",
    MaxResults: 20,
    SearchTarget: "Book",
  });

  const items = data?.item || [];
  console.log(`[알라딘 검색 - '${query}'] 결과:`, items);
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
