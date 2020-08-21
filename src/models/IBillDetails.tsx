import ICustomerDetails from "./ICustomerDetails";
import IItems from "./IItems";

export default interface IBillDetails {
  customer: ICustomerDetails;
  items: IItems[];
}
