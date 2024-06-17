import { TPacking } from "./packing";
import { TService } from "./service";

export type TFullRequest = {
  id: number;
  status: TStatus;
  moving_date?: Date | undefined;
  service: TService;
  service_id: number;
  packing: TPacking;
  packing_id: number;
  work_time: {
    min: number,
    max: number,
  },
  total_time: {
    min: number,
    max: number,
  },
  total_price: {
    min: number,
    max: number,
  },
  min_total_time: number;
  details: {
    delicate_items_question_answer: string,
    bulky_items_question_answer: string,
    disassemble_items_question_answer: string,
    comments: string,
  },
  size: string;
  travel_time: number;
  crew_size: number;
  rate: number;
  customer?: TCustomer | undefined;
  customer_id: number;
  origin: TAddress;
  destination: TAddress;
  stops: TStop[];
  sales_notes: string;
  driver_notes: string;
  customer_notes: string;
  dispatch_notes: string;
  deposit: number;
  can_edit_request: boolean;
  created_at: Date;
  updated_at: Date;
}

export type TStatus =
  | "Pending"
  | "Pending-info"
  | "Confirmed"
  | "Not Confirmed"
  | "Canceled"
  | "Completed"
  | "Not Available"
  | "Expired"
  | "Spam";

export type TAddress = {
  street: string;
  city: string;
  state: string;
  zip: string;
  apt?: string;
  floor: string;
  location: google.maps.LatLng | google.maps.LatLngLiteral
}

export type TStop = TAddress & {
  isPickup?: boolean;
  isDropoff?: boolean;
};

export type TCustomer = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  add_phone?: string | undefined;
}

export type TMenuRequest = {
  id: number;
  status: TStatus;
  origin: TAddress;
  destination: TAddress;
}


export type TStatusCounts = {
  "all": number;
  Pending: number;
  Confirmed: number;
  "Not Confirmed": number;
  Canceled: number;
  Completed: number;
  "Not Available": number;
  Expired: number;
  Spam: number;
}


export type TNewRequestData = {
  [key: string]: any
}
