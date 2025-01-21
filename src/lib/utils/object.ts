export const hasAtLeastOneField = (obj: Record<string | number, unknown>) =>
  Object.keys(obj).length > 0;
