// hooks/useToast.ts
import { toast, TypeOptions } from "react-toastify";

const TOAST_ID = "global-toast";

const useToast = () => {
  const showToast = (type: TypeOptions, message: string) => {
    if (toast.isActive(TOAST_ID)) {
      toast.update(TOAST_ID, {
        render: message,
        type,
        autoClose: 3000,
      });
    } else {
      toast(message, {
        toastId: TOAST_ID,
        type,
        autoClose: 3000,
      });
    }
  };

  const notifySuccess = (message: string) => showToast("success", message);
  const notifyError = (message: string) => showToast("error", message);
  const notifyInfo = (message: string) => showToast("info", message);
  const notifyWarning = (message: string) => showToast("warning", message);

  return { notifySuccess, notifyError, notifyInfo, notifyWarning };
};

export default useToast;