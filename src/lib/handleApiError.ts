export function handleApiError(error: unknown, notifyError: (msg: string) => void) {
  if (typeof error === "string") {
    console.log(error);
    notifyError(error);
    return;
  }

  const err = error as {
    errors?: Record<string, string[]>;
    message?: string;
  };

  if (err?.errors) {
    Object.values(err.errors)
      .flat()
      .forEach((message) => notifyError(message));
    return;
  }

  if (err?.message) {
    notifyError(err.message);
    return;
  }

  notifyError("حدث خطأ غير متوقع");
}
