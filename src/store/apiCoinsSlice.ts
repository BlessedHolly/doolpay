import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const apiCoinsSlice = createApi({
  reducerPath: "apiCoins",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://api.coinlore.net/api/exchange/?id=5",
  }),
  endpoints: (builder) => ({
    getCoins: builder.query({
      query: () => "",
      transformResponse: (response) => {
        if (!response || typeof response !== "object") {
          throw new Error("Неверный формат данных");
        }
        return response;
      },
      keepUnusedDataFor: 30,
    }),
  }),
});

export default apiCoinsSlice;

export const { useGetCoinsQuery } = apiCoinsSlice;
