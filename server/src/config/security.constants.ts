export const CONTACT_RATE_WINDOW_MS = 15 * 60 * 1000;
export const CONTACT_RATE_MAX = 5;

export const LOGIN_RATE_WINDOW_MS = 15 * 60 * 1000;
export const LOGIN_RATE_MAX = 5;

export const CONTACT_MESSAGE_MIN_LENGTH = 10;
export const CONTACT_MESSAGE_MAX_LENGTH = 5000;
export const CONTACT_NAME_MIN_LENGTH = 2;
export const CONTACT_NAME_MAX_LENGTH = 120;
export const CONTACT_SUBJECT_MAX_LENGTH = 200;

/** Honeypot alanı adı — gerçek kullanıcılar doldurmaz; botlar doldurursa istek reddedilir. */
export const HONEYPOT_FIELD = "hp_company";
