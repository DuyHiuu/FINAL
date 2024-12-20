import { configureStore } from "@reduxjs/toolkit";
// import { setupListeners } from "@reduxjs/toolkit/dist/query";

import statisticsApi from "./statistics";
import paymentApi from "./payment";

export const store = configureStore({
  reducer: {
    statistics: statisticsApi.reducer,
    payment: paymentApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(statisticsApi.middleware)
      .concat(paymentApi.middleware),
});

// setupListeners(store.dispatch);
// // Infer the `RootState` and `AppDispatch` types from the store itself
// export type RootState = ReturnType<typeof store.getState>;
// // Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
// export type AppDispatch = typeof store.dispatch;
