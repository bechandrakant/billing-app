import React, { useState } from "react";
import IBillDetails from "./models/IBillDetails";
import ICustomerDetails from "./models/ICustomerDetails";
import AddCustomerDetails from "./AddCustomerDetails";
import AddProductDetails from "./AddProductDetails";
import IItems from "./models/IItems";
import ProductList from "./ProductList";

const AddBill = (props: any) => {
  const [billState, setBillState] = useState<IBillDetails>({
    customer: {
      name: "",
      address: "",
      gstin: "",
      stateName: "",
      stateCode: "",
    },
    items: [],
  });

  const addCustomerDetail = (customerDetail: ICustomerDetails) => {
    setBillState({
      ...billState,
      customer: customerDetail,
    });
  };

  const addProductDetail = (productDetail: IItems) => {
    let products = billState.items;
    productDetail.id = billState.items.length + 1;
    products.push(productDetail);
    setBillState({
      ...billState,
      items: products,
    });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    props.addBill(billState);
  };

  return (
    <div>
      <AddCustomerDetails addCustomerDetail={addCustomerDetail} />
      <AddProductDetails addProductDetail={addProductDetail} />
      <ProductList products={[...billState.items]} />
    </div>
  );
};

export default AddBill;
