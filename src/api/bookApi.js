import axios from "axios";

const TTB_KEY = import.meta.env.VITE_ALADIN_TTB_KEY || "ttbqkrthgml21821151001";

const fetchAladinApi = async (endpoint, customParams = {}) => {
  try {
    // 💡 Vercel 환경에서는 vercel.json이 프록시를 처리하므로 /api/aladin/${endpoint}로 직접 호출합니다.
    const response = await axios.get(`/api/aladin/${endpoint}`, {
      params: {
        ttbkey: TTB_KEY,
        output: "js", // 💡 반드시 소문자 'output'이어야 알라딘이 JSON 형식을 반환합니다.
        Version: "20131101",
        OptResult: "fileFormat,ebookList,packing",
        ...customParams,
      },
    });

    let data = response.data;

    // 응답이 문자열로 올 경우(JSONP/세미콜론 포함) 정리 후 파싱
    if (typeof data === "string") {
      const cleanedData = data.trim().replace(/;$/, "");
      try {
        data = JSON.parse(cleanedData);
      } catch (e) {
        console.warn("[Aladin API] Data parse warning:", e);
      }
    }

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

  // 2차 검색: 결과가 없고 공백 없는 2글자 이상인 경우
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
