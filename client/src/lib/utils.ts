import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { AsYouType } from 'libphonenumber-js';
import { format } from "date-fns";

const COUNTRY = "US";
const asYouType = new AsYouType(COUNTRY);

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function formatPhone(value: string) {
  asYouType.reset();
  const formattedPhone = ("" + value).replace(/\D/g, "");
  if (formattedPhone.length >= 10) {
    return asYouType.input(formattedPhone.slice(0, 10));
  }
  return formattedPhone;
}

export function trimPhoneNumber(phoneNumber: string): string {
  return phoneNumber.replace(/\D/g, '');
}



export function formatMoney(
  price: number | string,
  options: {
    currency?: 'USD' | 'EUR' | 'GBP' | 'BDT'
    notation?: Intl.NumberFormatOptions['notation']
  } = {}
) {
  const { currency = 'USD', notation = 'standard' } = options

  const numericPrice =
    typeof price === 'string' ? parseFloat(price) / 100 : price / 100

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    notation,
    maximumFractionDigits: 2,
  }).format(numericPrice)
}

export function centsToDollars(cents: number) {
  return cents / 100;
}


export function formatDate(date: string | Date | null | undefined) {
  if (!date) return 'TBD';
  const dt = new Date(date);
  const dtDateOnly = new Date(dt.valueOf() + dt.getTimezoneOffset() * 60 * 1000);
  return format(dtDateOnly, 'PPP')
}

export async function fakeDelay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}


const range = (start: number, end: number) => Array.from(
  Array(Math.abs(end - start) + 1),
  (_, i) => start + i
);


export function paginationRange(totalPages: number, page: number, siblings = 1) {
  if (totalPages <= 1) {
    return [1];
  }
  let totalPagesNoInArray = 7 + siblings;
  if (totalPagesNoInArray >= totalPages) {
    return range(1, totalPages);
  }

  let leftSiblingsIndex = Math.max(page - siblings, 1);
  let rightSiblingsIndex = Math.min(page + siblings, totalPages);

  let showLeftEllipsis = leftSiblingsIndex > 2;
  let showRightEllipsis = rightSiblingsIndex < totalPages - 2;

  if (!showLeftEllipsis && showRightEllipsis) {
    let leftItemsCount = 3 + 2 * siblings;
    let leftRange = range(1, leftItemsCount + 1);
    return [...leftRange, '...', totalPages]
  } else if (showLeftEllipsis && !showRightEllipsis) {

    let rightItemsCount = 3 + 2 * siblings;
    let rightRange = range(totalPages - rightItemsCount + 1, totalPages);
    return [1, '...', ...rightRange]
  } else {
    let middleRange = range(leftSiblingsIndex, rightSiblingsIndex + 1);
    return [1, '...', ...middleRange, '...', totalPages]
  }

}





interface AnyObject {
  [key: string]: any;
}

export function deepCopy<T extends AnyObject>(obj: T): T {
  if (typeof obj !== "object" || obj === null) {
    return obj; // Return non-object values as-is
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => deepCopy(item) as unknown) as unknown as T; // Deep copy each element of the array
  }

  const newObj: Partial<T> = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];
      newObj[key] = deepCopy(value) as unknown as T[Extract<keyof T, string>]; // Cast value to appropriate type
    }
  }
  return newObj as unknown as T;
}


export function convertMinutesToHoursAndMinutes(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  const formattedHours = hours > 0 ? `${hours}h` : "";
  const formattedMinutes = remainingMinutes > 0 ? `${remainingMinutes}min` : "";
  return `${formattedHours} ${formattedMinutes}`.trim();
}


export function hasNonEmptyValues(obj: Record<string, any>) {
  for (const key in obj) {
    if (
      obj.hasOwnProperty(key) &&
      typeof obj[key] === "string" &&
      obj[key].trim() !== ""
    ) {
      return true; // Found a non-empty string value
    }
  }
  return false; // All values are empty strings or non-strings
}
