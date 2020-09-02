import React, { useState } from "react";
import AddBill from "./AddBill";
import GenerateBill from "./GenerateBill";
import IBillDetails from "./models/IBillDetails";

function App() {
  const [billState, setBillState] = useState<IBillDetails>({
    customer: {
      name: " ",
      address: " ",
      gstin: "",
      invoiceNumber: 0,
      stateName: " ",
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

  const addBill = (bill: IBillDetails) => {
    setBillState(bill);
  };

  return (
    <div style={{ display: "flex" }}>
      <AddBill addBill={addBill} />
      <GenerateBill {...billState} />
    </div>
  );
}

export default App;
