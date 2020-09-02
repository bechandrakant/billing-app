import React, { useState } from "react";
import { gstStateData } from "./data/GSTStateData";
import ICustomerDetails from "./models/ICustomerDetails";

const AddCustomerDetails = (props: any) => {
  const [customerDetails, setCustomerDetails] = useState<ICustomerDetails>({
    name: "",
    address: "",
    gstin: "",
    invoiceNumber: 0,
    stateName: "",
    stateCode: "",
  });

  const handleChange = (e: { target: { id: any; value: any } }) => {
    setCustomerDetails({
      ...customerDetails,
      [e.target.id]: e.target.value,
    });
  };

  const handleStateChange = (stateData: string) => {
    const stateCode = stateData.split("$")[0];
    const stateName = stateData.split("$")[1];
    setCustomerDetails({
      ...customerDetails,
      stateName: stateName,
      stateCode: stateCode,
    });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (
      customerDetails.address === "" ||
      customerDetails.name === "" ||
      customerDetails.invoiceNumber === 0 ||
      customerDetails.gstin === "" ||
      customerDetails.stateName === ""
    ) {
      if (customerDetails.gstin.length !== 15) {
        alert("Please enter valid GSTIN");
      }
      alert("Please enter customer details");
      return;
    }
    props.addCustomerDetail(customerDetails);
  };

  const renderStateOptions = () => {
    const options = gstStateData.map((data) => {
      return (
        <option
          key={data.stateCode}
          value={data.stateCode + "$" + data.stateName}
        >
          {data.stateName}
        </option>
      );
    });
    return (
      <select
        id="state"
        name="state"
        onChange={(e) => handleStateChange(e.target.value)}
      >
        <option value="">Select State</option>
        {options}
      </select>
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Name&nbsp;&nbsp;&nbsp;:&nbsp;</label>
      <input type="text" id="name" onChange={handleChange} />
      <br />
      <label>Address:&nbsp;</label>
      <input type="text" id="address" onChange={handleChange} />
      <br />
      <label>GST&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;</label>
      <input type="text" id="gstin" onChange={handleChange} />
      <br />
      <label>State&nbsp;</label>
      {renderStateOptions()}
      <br />
      <label>INVOICE NUMBER&nbsp;:&nbsp;</label>
      <input type="text" id="invoiceNumber" onChange={handleChange} />
      <br />
      <button type="submit">Add Customer Details</button>
    </form>
  );
};

export default AddCustomerDetails;
