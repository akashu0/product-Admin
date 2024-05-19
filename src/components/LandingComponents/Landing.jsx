import React, { useEffect, useState } from "react";
import SmallSpinner from "../SmallSpinner";
import ProductGrid from "./ProductGrid";
import Banner from "./Banner";
import useFetchData from "../../hook/useFetchData";

function Landing() {
  const apiURL = process.env.REACT_APP_API_URL;
  const {
    data: productData,
    loading: loadingProducts,
    error: errorProducts,
  } = useFetchData(`${apiURL}/product/getall-product`);
  const {
    data: bannerData,
    loading: loadingBanners,
    error: errorBanners,
  } = useFetchData(`${apiURL}/superAdmin/get-banners`);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrent((current) => (current + 1) % bannerData.length);
    }, 2000);
    return () => clearTimeout(timer);
  }, [current, bannerData.length]);

  if (loadingProducts || loadingBanners) {
    return <SmallSpinner />;
  }

  if (errorProducts || errorBanners) {
    return <p>Error loading data. Please try again later.</p>;
  }

  return (
    <>
      <Banner banners={bannerData} current={current} />
      <ProductGrid products={productData} />
    </>
  );
}

export default Landing;
