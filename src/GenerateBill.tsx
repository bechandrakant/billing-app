import React, { useState } from "react";
import { sellerData } from "./data/SellerData";
import IBillDetails from "./models/IBillDetails";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

const GenerateBill = (props: IBillDetails) => {
  const calculateTotal = () => {
    let total = 0;
    props.items.forEach((item) => (total += item.quantity * item.rate));
    return total;
  };

  const calculateGrandTotal = () => {
    let total = calculateTotal() - props.tax.discount;
    let totalTax = props.tax.cgst + props.tax.igst + props.tax.sgst;
    let grandTotal = total + (total * totalTax) / 100 / 100;
    return Math.round(grandTotal);
  };

  const renderProducts = () => {
    const defaultProducts = {
      id: 0,
      name: "",
      hsnCode: "",
      quantity: 0,
      rate: 0,
    };
    let newProducts = [...props.items];
    if (newProducts.length !== 12) {
      do {
        newProducts.push(defaultProducts);
      } while (newProducts.length !== 12);
    }
    let products = newProducts.map((item, index) => {
      return (
        <tr className="productTable" key={index}>
          <td style={{ flex: 1 }} className="tableBorder">
            {item.id !== 0 ? item.id : " "}
          </td>
          <td style={{ flex: 10 }} className="tableBorder">
            {item.name !== "" ? item.name : " "}
          </td>
          <td style={{ flex: 2 }} className="tableBorder">
            {item.hsnCode !== "" ? item.hsnCode : " "}
          </td>
          <td style={{ flex: 2 }} className="tableBorder">
            {item.rate !== 0 ? item.rate : " "}
          </td>
          <td style={{ flex: 2 }} className="tableBorder">
            {item.quantity !== 0 ? item.quantity : " "}
          </td>
          <td style={{ flex: 3 }} className="tableBorder">
            {item.quantity !== 0 || item.rate !== 0
              ? item.rate * item.quantity
              : "-"}
          </td>
        </tr>
      );
    });
    return products;
  };

  const renderGST = () => {
    if (props.customer.gstin !== "") {
      const gstin = props.customer.gstin
        .split("")
        .map((gst: any, index: number) => (
          <span className="boxify" key={index}>
            {gst}
          </span>
        ));
      return gstin;
    } else {
      const dummy = "ABCDEFGHIJKLMNO";
      const gstin = props.customer.gstin
        .split("")
        .map((gst: any, index: number) => {
          return (
            <span className="boxify" key={index}>
              -
            </span>
          );
        });
      return gstin;
    }
  };

  const saveBill = () => {
    const doc = new jsPDF({ orientation: "p", unit: "mm", format: "a4" });
    const element: any = document.getElementById("bill");
    html2canvas(element).then(function (canvas) {
      let img = canvas.toDataURL("image/png");
      doc.addImage(img, "JPEG", 3, 3, 204, 289);
      doc.save(props.customer.name + props.customer.invoiceNumber + "n.pdf");
    });
  };

  const printBill = () => {
    const doc = new jsPDF({ orientation: "p", unit: "mm", format: "a4" });
    const element: any = document.getElementById("bill");
    html2canvas(element).then(function (canvas) {
      let img = canvas.toDataURL("image/png");
      doc.addImage(img, "JPEG", 3, 3, 204, 289);
      doc.autoPrint();
      doc.save(props.customer.name + props.customer.invoiceNumber + "n.pdf");
    });
  };

  const amountInWords = () => {
    let price: any = calculateGrandTotal() + "";
    let sglDigit = [
        "Zero",
        "One",
        "Two",
        "Three",
        "Four",
        "Five",
        "Six",
        "Seven",
        "Eight",
        "Nine",
      ],
      dblDigit = [
        "Ten",
        "Eleven",
        "Twelve",
        "Thirteen",
        "Fourteen",
        "Fifteen",
        "Sixteen",
        "Seventeen",
        "Eighteen",
        "Nineteen",
      ],
      tensPlace = [
        "",
        "Ten",
        "Twenty",
        "Thirty",
        "Forty",
        "Fifty",
        "Sixty",
        "Seventy",
        "Eighty",
        "Ninety",
      ],
      handle_tens = function (dgt: number, prevDgt: number) {
        return 0 == dgt
          ? ""
          : " " + (1 == dgt ? dblDigit[prevDgt] : tensPlace[dgt]);
      },
      handle_utlc = function (dgt: number, nxtDgt: number, denom: any) {
        return (
          (0 != dgt && 1 != nxtDgt ? " " + sglDigit[dgt] : "") +
          (0 != nxtDgt || dgt > 0 ? " " + denom : "")
        );
      };

    let str = "",
      digitIdx = 0,
      digit = 0,
      nxtDigit = 0,
      words = [];
    if (((price += ""), isNaN(parseInt(price)))) str = "";
    else if (parseInt(price) > 0 && price.length <= 10) {
      for (digitIdx = price.length - 1; digitIdx >= 0; digitIdx--)
        switch (
          ((digit = price[digitIdx] - 0),
          (nxtDigit = digitIdx > 0 ? price[digitIdx - 1] - 0 : 0),
          price.length - digitIdx - 1)
        ) {
          case 0:
            words.push(handle_utlc(digit, nxtDigit, ""));
            break;
          case 1:
            words.push(handle_tens(digit, price[digitIdx + 1]));
            break;
          case 2:
            words.push(
              0 != digit
                ? " " +
                    sglDigit[digit] +
                    " Hundred" +
                    (0 != price[digitIdx + 1] && 0 != price[digitIdx + 2]
                      ? " and"
                      : "")
                : ""
            );
            break;
          case 3:
            words.push(handle_utlc(digit, nxtDigit, "Thousand"));
            break;
          case 4:
            words.push(handle_tens(digit, price[digitIdx + 1]));
            break;
          case 5:
            words.push(handle_utlc(digit, nxtDigit, "Lakh"));
            break;
          case 6:
            words.push(handle_tens(digit, price[digitIdx + 1]));
            break;
          case 7:
            words.push(handle_utlc(digit, nxtDigit, "Crore"));
            break;
          case 8:
            words.push(handle_tens(digit, price[digitIdx + 1]));
            break;
          case 9:
            words.push(
              0 != digit
                ? " " +
                    sglDigit[digit] +
                    " Hundred" +
                    (0 != price[digitIdx + 1] || 0 != price[digitIdx + 2]
                      ? " and"
                      : " Crore")
                : ""
            );
        }
      str = words.reverse().join("");
    } else str = "";
    return str;
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <button style={{ marginRight: 50 }} onClick={saveBill}>
          Save Bill
        </button>
        <button onClick={printBill}>Print Bill</button>
      </div>

      <div id="bill">
        <div className="row">
          <div id="gstNo">GSTIN: {sellerData.gstin}</div>
          <div id="taxInvoiceLabel">TAX INVOICE</div>
          <div id="contactNo">
            {sellerData.contactDetails[0]} <br />
            {sellerData.contactDetails[1]}
          </div>
        </div>
        <div style={{ textAlign: "center" }}>
          <h2 id="companyName">{sellerData.name}</h2>
          <h6 id="address">
            {sellerData.address.address + ", " + sellerData.address.city}
          </h6>
        </div>
        <div className="row" style={{ borderTop: "1px solid black" }}>
          <p>Customer Details</p>
        </div>
        <div className="row outerBorder" style={{ padding: 10 }}>
          <div id="customerDetailsField">
            <p>Name</p>
            <p>Address</p>
            <p>&nbsp; </p>
            <p>GSTIN</p>
            <p>State</p>
          </div>
          <div id="customerDetailsData">
            <p className="dottedBorderBottom">{props.customer.name + "."}</p>
            <p className="dottedBorderBottom">
              {props.customer.address.slice(
                0,
                props.customer.address.lastIndexOf(" ")
              ) + ","}
            </p>
            <p className="dottedBorderBottom">
              {props.customer.address.slice(
                props.customer.address.lastIndexOf(" ")
              ) + "."}
            </p>
            <p>{renderGST()}</p>
            <p style={{ display: "flex" }}>
              <span style={{ flex: 1, borderBottom: "1px dotted black" }}>
                {props.customer.stateName}
              </span>
              <span style={{ margin: "0px 10px" }}>
                State Code:{" "}
                <span className="boxify">
                  {props.customer.stateCode ? props.customer.stateCode[0] : " "}
                </span>
                <span className="boxify">
                  {props.customer.stateCode ? props.customer.stateCode[1] : " "}
                </span>
              </span>
            </p>
          </div>
          <div
            id="invoiceDetails"
            className="outerBorder"
            style={{ display: "flex", flexDirection: "column" }}
          >
            <div
              className="outerBorder"
              style={{ flex: 1, width: "100%", paddingTop: "20px" }}
            >
              Invoice No: {props.customer.invoiceNumber}
            </div>
            <div
              className="outerBorder"
              style={{ flex: 1, width: "100%", paddingTop: "20px" }}
            >
              Invoice Date:{" "}
              {new Date().toDateString().slice(8, 11) +
                new Date().toDateString().slice(4, 8) +
                new Date().toDateString().slice(11)}
            </div>
            <div
              className="outerBorder"
              style={{ flex: 1, width: "100%", paddingTop: "20px" }}
            >
              State Code: 09 (UP)
            </div>
          </div>
        </div>
        <div
          className="row"
          id="productsTable"
          style={{
            flex: 1,
            borderBottom: "1px solid black",
            marginTop: "20px",
          }}
        >
          <table width="100%">
            <thead>
              <tr className="productTable">
                <th style={{ flex: 1 }} className="outerBorder">
                  S.no
                </th>
                <th style={{ flex: 10 }} className="outerBorder">
                  Name of Product
                </th>
                <th style={{ flex: 2 }} className="outerBorder">
                  HSN Code
                </th>
                <th style={{ flex: 2 }} className="outerBorder">
                  Rate
                </th>
                <th style={{ flex: 2 }} className="outerBorder">
                  Quantity
                </th>
                <th style={{ flex: 3 }} className="outerBorder">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {renderProducts()}
              <tr className="productTable">
                <td style={{ flex: 1 }} className="tableBorder"></td>
                <td style={{ flex: 10 }} className="tableBorder"></td>
                <td
                  style={{ flex: 6, paddingLeft: "5px", paddingRight: "5px" }}
                  className="outerBorder"
                >
                  Total
                </td>
                <td style={{ flex: 3 }} className="outerBorder">
                  {calculateTotal()}
                </td>
              </tr>
              <tr className="productTable">
                <td style={{ flex: 1 }} className="tableBorder"></td>
                <td style={{ flex: 10 }} className="tableBorder"></td>
                <td
                  style={{ flex: 6, paddingLeft: "5px", paddingRight: "5px" }}
                  className="outerBorder"
                >
                  Less Discount
                </td>
                <td style={{ flex: 3 }} className="outerBorder">
                  {props.tax.discount}
                </td>
              </tr>

              <tr className="productTable">
                <td
                  style={{
                    flex: 11,
                    borderTop: "1px solid black",
                    borderBottom: "1px dotted black",
                    textAlign: "left",
                  }}
                  className="tableBorder"
                >
                  <strong>(Amount in words) </strong>
                  {"   " + amountInWords().split(" ").slice(0, 6).join(" ")}
                </td>
                <td
                  style={{ flex: 6, paddingLeft: "4px", paddingRight: "4px" }}
                  className="outerBorder"
                >
                  Total Taxable Value
                </td>
                <td style={{ flex: 3 }} className="outerBorder">
                  {calculateTotal() - props.tax.discount}
                </td>
              </tr>
              <tr className="productTable">
                <td
                  style={{
                    flex: 11,
                    borderBottom: "1px dotted black",
                    textAlign: "center",
                  }}
                  className="tableBorder"
                >
                  {amountInWords().split(" ").length > 6
                    ? amountInWords().split(" ").slice(6).join(" ") + " only"
                    : ""}
                </td>
                <td
                  style={{ flex: 6, paddingLeft: "4px", paddingRight: "4px" }}
                  className="outerBorder"
                >
                  SGST @ {props.tax.sgst} %
                </td>
                <td style={{ flex: 3 }} className="outerBorder">
                  {((calculateTotal() - props.tax.discount) * props.tax.sgst) /
                    100}
                </td>
              </tr>
              <tr className="productTable">
                <td style={{ flex: 1, borderLeft: "1px solid black" }}></td>
                <td style={{ flex: 10, textAlign: "left" }}>
                  <strong>Bank Details: </strong>
                </td>
                <td
                  style={{ flex: 6, paddingLeft: "4px", paddingRight: "4px" }}
                  className="outerBorder"
                >
                  CGST @ {props.tax.cgst} %
                </td>
                <td style={{ flex: 3 }} className="outerBorder">
                  {((calculateTotal() - props.tax.discount) * props.tax.cgst) /
                    100}
                </td>
              </tr>
              <tr className="productTable">
                <td style={{ flex: 1, borderLeft: "1px solid black" }}></td>
                <td style={{ flex: 10, textAlign: "left", fontWeight: 300 }}>
                  Bank Name: {sellerData.bankDetails.bankName}
                </td>
                <td
                  style={{ flex: 6, paddingLeft: "4px", paddingRight: "4px" }}
                  className="outerBorder"
                >
                  IGST @ {props.tax.igst} %
                </td>
                <td style={{ flex: 3 }} className="outerBorder">
                  {((calculateTotal() - props.tax.discount) * props.tax.igst) /
                    100}
                </td>
              </tr>
              <tr className="productTable">
                <td style={{ flex: 1, borderLeft: "1px solid black" }}></td>
                <td style={{ flex: 10, textAlign: "left", fontWeight: 300 }}>
                  Bank Account Number: {sellerData.bankDetails.accountNo}
                </td>
                <td
                  style={{ flex: 6, paddingLeft: "5px", paddingRight: "5px" }}
                  className="outerBorder"
                >
                  Grand Total Invoice
                </td>
                <td style={{ flex: 3 }} className="outerBorder">
                  {calculateGrandTotal()}
                </td>
              </tr>
              <tr className="productTable">
                <td
                  style={{
                    flex: 1,
                    borderLeft: "1px solid black",
                    borderBottom: "1px solid black",
                  }}
                ></td>
                <td
                  style={{
                    flex: 10,
                    textAlign: "left",
                    fontWeight: 300,
                    borderBottom: "1px solid black",
                  }}
                >
                  Bank Branch IFSC: {sellerData.bankDetails.ifsc}
                </td>
                <td
                  style={{ flex: 6, paddingLeft: "5px", paddingRight: "5px" }}
                  className="outerBorder"
                >
                  Tax Payable on Reverse Charge
                </td>
                <td style={{ flex: 3 }} className="outerBorder">
                  {props.tax.taxPayableOnReverseCharge}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="row" id="termsAndConditions" style={{ marginTop: 10 }}>
          <div style={{ flex: 1 }}>
            <h6
              style={{
                textAlign: "left",
                marginTop: "10px",
                marginBottom: "10px",
                marginRight: "'20px'",
                marginLeft: "'20px'",
              }}
            >
              Terms &amp; Conditions
            </h6>
            <ul style={{ textAlign: "left" }}>
              <li>All Disputes Subject to Agra Jurisdiction Only</li>
              <li>Goods once sold will not be taken back</li>
              <li>
                Seller is not responsible for any loss/damage of goods in
                transit
              </li>
              <li>Goods are dispatched on buyers risk</li>
              <li>
                Guarantee on item is responsibility of manufacturer not seller
              </li>
            </ul>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ flex: 3, marginTop: "10px" }}>
              For: Sharma Paint Hardware &amp; Sanitary Store
            </div>
            <div style={{ flex: 1 }}>Authorized Signatory</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerateBill;
