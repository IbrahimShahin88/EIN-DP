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

export function optionalString(value: unknown, maxLength = 255) {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  return requireString(value, "value", maxLength);
}

export function requireEmail(value: unknown) {
  const email = requireString(value, "email", 320).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("email is invalid.");
  }

  return email;
}

export function requirePassword(value: unknown) {
  return requireString(value, "password", 256);
}

export function requireEnum<T extends readonly string[]>(value: unknown, field: string, allowed: T): T[number] {
  const text = requireString(value, field, 100);
  if (!allowed.includes(text)) {
    throw new Error(`${field} is invalid.`);
  }

  return text;
}
