import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const paymentApi = createApi({
  reducerPath: "payment",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8000/api",
  }),
  tagTypes: ["payment"],
  endpoints: (builder) => ({
    checkPay: builder.mutation<any, any>({
      query: (body) => ({
        url: `/check_payment`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["payment"],
    }),
  }),
});
export const { useCheckPayMutation } = paymentApi;
export default paymentApi;
