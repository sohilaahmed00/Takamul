export function handleApiSuccess(response: unknown, notifySuccess: (msg: string) => void) {
  if (typeof response === "string") {
    notifySuccess(response);
    return;
  }

  const res = response as { message?: string };

  if (res?.message) {
    notifySuccess(res.message);
    return;
  }

  notifySuccess("تمت العملية بنجاح");
}
