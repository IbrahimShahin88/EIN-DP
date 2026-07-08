export function requireString(value: unknown, field: string, maxLength = 255) {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${field} is required.`);
  }

  const trimmed = value.trim();
  if (trimmed.length > maxLength) {
    throw new Error(`${field} is too long.`);
  }

  return trimmed;
}

export function requireEmail(value: unknown) {
  const email = requireString(value, "email", 320).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("email is invalid.");
  }

  return email;
}

export function requireStrongPassword(value: unknown) {
  const password = requireString(value, "password", 256);
  if (password.length < 10) {
    throw new Error("password must be at least 10 characters.");
  }

  return password;
}

export function optionalString(value: unknown, maxLength = 1000) {
  if (value === undefined || value === null || value === "") {
    return null;
  }
  if (typeof value !== "string") {
    throw new Error("Invalid text value.");
  }

  return value.trim().slice(0, maxLength);
}

export function optionalNumber(value: unknown) {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  const numberValue = Number(value);
  if (!Number.isFinite(numberValue)) {
    throw new Error("Invalid numeric value.");
  }

  return numberValue;
}

export function requireNumber(value: unknown, field: string) {
  const numberValue = optionalNumber(value);
  if (numberValue === null || !Number.isInteger(numberValue)) {
    throw new Error(`${field} is required.`);
  }

  return numberValue;
}

export function requireEnum<T extends readonly string[]>(value: unknown, field: string, allowed: T): T[number] {
  const text = requireString(value, field, 100);
  if (!allowed.includes(text)) {
    throw new Error(`${field} is invalid.`);
  }

  return text;
}

export function optionalEnum<T extends readonly string[]>(value: unknown, allowed: T, fallback: T[number]): T[number] {
  if (value === undefined || value === null || value === "") {
    return fallback;
  }

  return requireEnum(value, "value", allowed);
}
