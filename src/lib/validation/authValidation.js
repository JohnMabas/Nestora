/**
 * @fileoverview  Shared auth form validation helpers.
 *
 * Each function returns a string error message when the value is invalid,
 * or null when it passes. This keeps regex and business rules in one place
 * so login, register, and future password-change forms all behave identically.
 *
 * These are purely presentation-layer rules — the real backend will run its
 * own validation on every request.
 */

const EMAIL_RE   = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE   = /^[+\d][\d\s\-().]{5,14}$/;
const NAME_RE    = /^[A-Za-z\s'\-]+$/;

// ─── Individual field validators ──────────────────────────────────────────────

/**
 * @param {string} value
 * @returns {string|null}
 */
export function validateEmail(value) {
  if (!value || !value.trim()) return "Email is required";
  if (!EMAIL_RE.test(value.trim())) return "Enter a valid email address";
  return null;
}

/**
 * @param {string} value
 * @returns {string|null}
 */
export function validatePassword(value) {
  if (!value) return "Password is required";
  if (value.length < 6) return "Password must be at least 6 characters";
  return null;
}

/**
 * @param {string} value
 * @returns {string|null}
 */
export function validateName(value) {
  const trimmed = value?.trim() ?? "";
  if (!trimmed) return "Full name is required";
  if (trimmed.length < 2) return "Name must be at least 2 characters";
  if (!NAME_RE.test(trimmed)) return "Name can only contain letters and spaces";
  return null;
}

/**
 * @param {string} value
 * @returns {string|null}
 */
export function validatePhone(value) {
  const trimmed = value?.trim() ?? "";
  if (!trimmed) return "Phone number is required";
  if (!PHONE_RE.test(trimmed)) return "Enter a valid phone number";
  return null;
}

/**
 * @param {string} value
 * @returns {string|null}
 */
export function validateAgencyName(value) {
  if (!value?.trim()) return "Agency name is required";
  return null;
}

/**
 * @param {string} value
 * @returns {string|null}
 */
export function validateLicenseNumber(value) {
  if (!value?.trim()) return "License number is required";
  return null;
}

/**
 * @param {string} password
 * @param {string} confirm
 * @returns {string|null}
 */
export function validateConfirmPassword(password, confirm) {
  if (!confirm) return "Please confirm your password";
  if (confirm !== password) return "Passwords do not match";
  return null;
}

/**
 * @param {boolean} checked
 * @returns {string|null}
 */
export function validateTerms(checked) {
  if (!checked) return "You must accept the terms to register";
  return null;
}

// ─── Whole-form validators (convenience wrappers) ─────────────────────────────

/**
 * Validates all login fields. Returns a map of fieldName → error string.
 * If a field passes, its key is absent from the returned object.
 *
 * @param {{ email: string, password: string }} fields
 * @returns {Record<string, string>}
 */
export function validateLoginForm({ email, password }) {
  const errors = {};
  const emailErr = validateEmail(email);
  const pwErr    = validatePassword(password);
  if (emailErr) errors.email    = emailErr;
  if (pwErr)    errors.password = pwErr;
  return errors;
}

/**
 * Validates all agent-register fields. Returns a map of fieldName → error.
 *
 * @param {{ name: string, email: string, phone: string, agencyName: string,
 *           licenseNumber: string, password: string, confirmPassword: string,
 *           terms: boolean }} fields
 * @returns {Record<string, string>}
 */
export function validateRegisterForm(fields) {
  const errors = {};
  const checks = {
    name:            validateName(fields.name),
    email:           validateEmail(fields.email),
    phone:           validatePhone(fields.phone),
    agencyName:      validateAgencyName(fields.agencyName),
    licenseNumber:   validateLicenseNumber(fields.licenseNumber),
    password:        validatePassword(fields.password),
    confirmPassword: validateConfirmPassword(fields.password, fields.confirmPassword),
    terms:           validateTerms(fields.terms),
  };
  for (const [key, err] of Object.entries(checks)) {
    if (err) errors[key] = err;
  }
  return errors;
}

/**
 * Validates the buyer register form (name, email, password, confirm, terms).
 *
 * @param {{ name: string, email: string, password: string,
 *           confirm: string, agreed: boolean }} fields
 * @returns {Record<string, string>}
 */
export function validateBuyerRegisterForm({ name, email, password, confirm, agreed }) {
  const errors = {};
  const nameErr    = validateName(name);
  const emailErr   = validateEmail(email);
  const pwErr      = validatePassword(password);
  const confirmErr = validateConfirmPassword(password, confirm);
  const termsErr   = validateTerms(agreed);
  if (nameErr)    errors.name    = nameErr;
  if (emailErr)   errors.email   = emailErr;
  if (pwErr)      errors.password = pwErr;
  if (confirmErr) errors.confirm  = confirmErr;
  if (termsErr)   errors.agreed   = termsErr;
  return errors;
}
