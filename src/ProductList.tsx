import React from "react";
import IItems from "./models/IItems";

const ProductList = (props: any) => {
  const productList = props.products.map((product: IItems) => {
    return (
      <tr key={product.id}>
        <td>{product.id}</td>
        <td>{product.name}</td>
        <td>{product.hsnCode}</td>
        <td>{product.rate}</td>
        <td>{product.quantity}</td>
        <td>{product.rate * product.quantity}</td>
      </tr>
    );
  });
  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>S.no</th>
            <th>Name of Product</th>
            <th>HSN Code</th>
            <th>Quantity</th>
            <th>Rate</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>{productList}</tbody>
      </table>
    </div>
  );
};

export default ProductList;
