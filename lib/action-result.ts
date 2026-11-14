export const fail = (message: string) => ({
  success: false as const,
  message,
});

export const GENERIC_ERROR = "حصلت مشكلة غير متوقعة. حاول تاني.";