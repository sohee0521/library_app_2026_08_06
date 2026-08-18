import axios from "axios";

const TTB_KEY = import.meta.env.VITE_ALADIN_TTB_KEY || "ttbqkrthgml21821151001";

const fetchAladinApi = async (endpoint, customParams = {}) => {
  try {
    const response = await axios.get(`/api/aladin/${endpoint}`, {
      params: {
        ttbkey: TTB_KEY,
        output: "js",
        Version: "20131101",
        OptResult: "fileFormat,ebookList,packing",
        ...customParams,
      },
    });

    let data = response.data;

    // 응답이 문자열로 넘어올 경우 JSON 객체로 파싱
    if (typeof data === "string") {
      let cleaned = data.trim();
      // 알라딘 JS 변수 선언문 제거 (예: ttb_itemsearch_result = {...};)
      if (cleaned.includes("=")) {
        cleaned = cleaned.substring(cleaned.indexOf("=") + 1).trim();
      }
      // 끝자리 세미콜론 제거
      cleaned = cleaned.replace(/;$/, "");

      try {
        data = JSON.parse(cleaned);
      } catch (e) {
        console.warn("[Aladin API] JSON parse warning:", e);
      }
    }

    return data;
  } catch (error) {
    console.error(`[Aladin API Error] ${endpoint}:`, error);
    return null;
  }
};

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
  return data?.item || [];
};

export const searchAladinBooks = async (query) => {
  if (!query || !query.trim()) return [];
  const trimmedQuery = query.trim();

  const data = await fetchAladinApi("ItemSearch.aspx", {
    Query: trimmedQuery,
    QueryType: "Title",
    MaxResults: 20,
    SearchTarget: "Book",
  });

  let items = data?.item || [];

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

export const getAladinBookDetail = async (itemId, itemIdType = "ItemId") => {
  if (!itemId) return null;
  const data = await fetchAladinApi("ItemLookUp.aspx", {
    ItemId: itemId,
    ItemIdType: itemIdType,
  });
  return data?.item?.[0] || null;
};
