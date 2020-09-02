import ICustomerDetails from "./ICustomerDetails";
import IItems from "./IItems";
import ITaxDetails from "./ITaxDetails";

export default interface IBillDetails {
  customer: ICustomerDetails;
  items: IItems[];
  tax: ITaxDetails;
}
