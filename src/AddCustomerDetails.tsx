import React, { useState } from "react";
import { gstStateData } from "./data/GSTStateData";
import ICustomerDetails from "./models/ICustomerDetails";

const AddCustomerDetails = (props: any) => {
  const [customerDetails, setCustomerDetails] = useState<ICustomerDetails>({
    name: "",
    address: "",
    gstin: "",
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
    props.addCustomerDetails(customerDetails);
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
        {options}
      </select>
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Name:</label>
      <input type="text" id="name" onChange={handleChange} />
      <label>Address:</label>
      <input type="text" id="address" onChange={handleChange} />
      <label>GST:</label>
      <input type="text" id="gstin" onChange={handleChange} />
      <label>State:</label>
      {renderStateOptions()}
    </form>
  );
};

export default AddCustomerDetails;
