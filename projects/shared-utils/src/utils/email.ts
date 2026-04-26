const getDomain = (email: string) => {
  if (!email || typeof email !== 'string') {
    return 'unknown';
  }

  const parts = email.split('@');

  if (parts.length !== 2) {
    return 'unknown';
  }

  return parts[1] || 'unknown';
};

export const emailUtils = {
  getDomain,
};
