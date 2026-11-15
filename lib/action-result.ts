export const fail = (message: string) => ({
  success: false as const,
  message,
});

export const GENERIC_ERROR = "حدث خطأ غير متوقع. حاول مرة أخري.";