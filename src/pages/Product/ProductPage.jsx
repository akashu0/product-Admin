import React from "react";
import SimpleNavbar from "../../components/NavBar/SimpleNavbar";
import ProductAddingPage from "../../components/Admin/Products/ProductAddingPage";
import AddProduct from "../../components/Admin/Products/AddProduct";

function ProductPage() {
  return (
    <>
      <SimpleNavbar />
      {/* <ProductAddingPage /> */}
      <AddProduct />
    </>
  );
}

export default ProductPage;
