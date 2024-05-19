// rootReducer.js
import { combineReducers } from "@reduxjs/toolkit";
import formReducer from "./formSlice";
// import productSlice from "./productSlice";
// import variationSlice from "./variation";
// import priceSlice from "./pricing";
// import productIdSlice from "./productId";
import tokenSlice from "./tokenSlice";
import userDetailsSlice from "./userDetails";

const rootReducer = combineReducers({
  form: formReducer,
  //   product: productSlice,
  //   variation: variationSlice,
  //   price: priceSlice,
  //   productId: productIdSlice,
  token: tokenSlice,
  userDetails: userDetailsSlice,
});

export default rootReducer;
