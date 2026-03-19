import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteAddition } from "../services/additions";
import axios from "axios";
import { additionsKeys } from "../keys/additions.keys";
import useToast from "@/hooks/useToast";

export function useDeleteAddition() {
  const queryClient = useQueryClient();
  const { notifyError, notifySuccess } = useToast();
  return useMutation({
    mutationFn: (id: number) => deleteAddition(id),
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: additionsKeys.list(),
      });
      notifySuccess(response?.message);
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        const res = error?.response?.data;
        if (res?.errors) {
          Object.values(res.errors)
            .flat()
            .forEach((message) => {
              notifyError(String(message));
            });
        } else if (res) {
          notifyError(res);
        } else {
          notifyError("حدث خطأ غير متوقع");
        }
      }
    },
  });
}
