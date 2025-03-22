import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "./themeSlice";
import apiAccountSlice from "./apiAccountSlice";
import apiCoinsSlice from "./apiCoinsSlice";

const store = configureStore({
  reducer: {
    theme: themeReducer,
    [apiAccountSlice.reducerPath]: apiAccountSlice.reducer,
    [apiCoinsSlice.reducerPath]: apiCoinsSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(apiAccountSlice.middleware)
      .concat(apiCoinsSlice.middleware),
});

export type TStore = ReturnType<typeof store.getState>;
export default store;
