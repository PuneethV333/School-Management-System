import { parsePhoneNumberFromString } from "libphonenumber-js";

export const validateIndianPhone = (phone: string): boolean => {
  const parsed = parsePhoneNumberFromString(phone, "IN");

  return parsed ? parsed.isValid() : false;
};

export const formatIndianPhone = (phone: string): string | null => {
  const parsed = parsePhoneNumberFromString(phone, "IN");

  return parsed && parsed.isValid() ? parsed.number : null;
};