import React, { useState } from "react";
import IItems from "./models/IItems";

const AddProductDetails = (props: any) => {
  const [productDetail, setProductDetail] = useState<IItems>({
    id: 0,
    name: "",
    hsnCode: "",
    quantity: 0,
    rate: 0,
  });

  const handleChange = (e: { target: { id: any; value: any } }) => {
    setProductDetail({
      ...productDetail,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (
      productDetail.name !== "" &&
      productDetail.hsnCode !== "" &&
      productDetail.quantity !== 0 &&
      productDetail.rate !== 0
    ) {
      props.addProductDetail(productDetail);
      setProductDetail({
        id: 0,
        name: "",
        hsnCode: "",
        quantity: 0,
        rate: 0,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Name of Product:</label>
      <input
        type="text"
        id="name"
        onChange={handleChange}
        value={productDetail.name}
      />
      <label>HSN Code:</label>
      <input
        type="text"
        id="hsnCode"
        onChange={handleChange}
        value={productDetail.hsnCode}
      />
      <label>QTY:</label>
      <input
        type="number"
        id="quantity"
        onChange={handleChange}
        value={productDetail.quantity}
      />
      <label>RATE:</label>
      <input
        type="number"
        id="rate"
        onChange={handleChange}
        value={productDetail.rate}
      />
      <button>Add Product</button>
    </form>
  );
};

export default AddProductDetails;
