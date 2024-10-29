import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const statisticsApi = createApi({
  reducerPath: "statistics",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8000/api/admin",
  }),
  tagTypes: ["statistics"],
  endpoints: (builder) => ({
    revenueAllAPI: builder.mutation<any, any>({
      query: (body) => ({
        url: `/total_revenue`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["statistics"],
    }),
  }),
});
export const { useRevenueAllAPIMutation } = statisticsApi;
export default statisticsApi;
