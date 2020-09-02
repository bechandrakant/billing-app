import React, { useState } from "react";
import IBillDetails from "./models/IBillDetails";
import ICustomerDetails from "./models/ICustomerDetails";
import AddCustomerDetails from "./AddCustomerDetails";
import AddProductDetails from "./AddProductDetails";
import IItems from "./models/IItems";
import ProductList from "./ProductList";
import AddBillMetaData from "./AddBillMetaData";
import ITaxDetails from "./models/ITaxDetails";

const AddBill = (props: any) => {
  const defaultProducts = {
    id: 0,
    name: "",
    hsnCode: "",
    quantity: 0,
    rate: 0,
  };

  const [billState, setBillState] = useState<IBillDetails>({
    customer: {
      name: "",
      address: "",
      gstin: "",
      invoiceNumber: 0,
      stateName: "",
      stateCode: "",
    },
    items: [],
    tax: {
      sgst: 0,
      cgst: 0,
      igst: 0,
      discount: 0,
      taxPayableOnReverseCharge: 0,
    },
  });

  const addCustomerDetail = (customerDetail: ICustomerDetails) => {
    setBillState({
      ...billState,
      customer: customerDetail,
    });
    props.addBill({
      ...billState,
      customer: customerDetail,
    });
  };

  const addProductDetail = (productDetail: IItems) => {
    let products = billState.items;
    productDetail.id = billState.items.length + 1;
    products.push(productDetail);
    if (products.length > 12) {
      alert("Can't Enter more than 12 products");
      return;
    }
    setBillState({
      ...billState,
      items: products,
    });
    let newProducts = [...products];
    if (products.length !== 12) {
      do {
        newProducts.push(defaultProducts);
      } while (newProducts.length !== 12);
    }
    props.addBill({
      ...billState,
      items: newProducts,
    });
  };

  const addTaxDetail = (taxDetail: ITaxDetails) => {
    setBillState({
      ...billState,
      tax: taxDetail,
    });
    props.addBill({
      ...billState,
      tax: taxDetail,
    });
  };

  return (
    <div>
      <h5>Enter Customer Details</h5>
      <AddCustomerDetails addCustomerDetail={addCustomerDetail} />
      <h5>Enter Product Details</h5>
      <AddProductDetails addProductDetail={addProductDetail} />
      <h5>Enter Tax Details</h5>
      <AddBillMetaData addTaxDetail={addTaxDetail} />
    </div>
  );
};

export default AddBill;
