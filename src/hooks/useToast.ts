// hooks/useToast.js
import { toast } from "react-toastify";

const useToast = () => {
  const notifySuccess = (message: string) => toast.success(message);
  const notifyError = (message: string) => toast.error(message);
  const notifyInfo = (message: string) => toast.info(message);
  const notifyWarning = (message: string) => toast.warn(message);
  // Add more customized functions as needed

  return { notifySuccess, notifyError, notifyInfo, notifyWarning };
};

export default useToast;
