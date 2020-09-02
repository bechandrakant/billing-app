import React, { useState } from "react";
import IItems from "./models/IItems";
import ITaxDetails from "./models/ITaxDetails";

const AddBillMetaData = (props: any) => {
  const [taxDetail, setTaxDetail] = useState<ITaxDetails>({
    sgst: 0,
    cgst: 0,
    igst: 0,
    discount: 0,
    taxPayableOnReverseCharge: 0,
  });

  const handleChange = (e: { target: { id: any; value: any } }) => {
    setTaxDetail({
      ...taxDetail,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    props.addTaxDetail(taxDetail);
    setTaxDetail({
      sgst: 0,
      cgst: 0,
      igst: 0,
      discount: 0,
      taxPayableOnReverseCharge: 0,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Discount :&nbsp;</label>
      <input
        type="text"
        id="discount"
        onChange={handleChange}
        value={taxDetail.discount}
      />
      <br />
      <label>SGST :&nbsp;</label>
      <input
        type="text"
        id="sgst"
        onChange={handleChange}
        value={taxDetail.sgst}
      />
      <br />
      <label>CGST :&nbsp;</label>
      <input
        type="number"
        id="cgst"
        onChange={handleChange}
        value={taxDetail.cgst}
      />
      <br />
      <label>IGST :&nbsp;</label>
      <input
        type="number"
        id="igst"
        onChange={handleChange}
        value={taxDetail.igst}
      />
      <br />
      <label>
        Tax payable on
        <br />
        reverse charge :&nbsp;
      </label>
      <input
        type="number"
        id="taxPayableOnReverseCharge"
        onChange={handleChange}
        value={taxDetail.taxPayableOnReverseCharge}
      />
      <br />
      <button>Add Tax Details</button>
      <br />
    </form>
  );
};

export default AddBillMetaData;
