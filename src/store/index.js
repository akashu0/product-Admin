// store.js
import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";
import rootReducer from "./reducer";
import { resetFormState } from "./formSlice";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// window.addEventListener("beforeunload", () => {
//   store.dispatch(resetFormState());
// });

export const store = configureStore({
  reducer: persistedReducer,
});
