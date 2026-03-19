import { useMutation, useQueryClient } from "@tanstack/react-query";
import useToast from "@/hooks/useToast";
import { additionsKeys } from "../keys/additions.keys";
import { createAdditions } from "../services/additions";
import type { createAddition } from "../types/additions.types";
import axios from "axios";

export function useCreateAddition() {
  const queryClient = useQueryClient();
  const { notifyError, notifySuccess } = useToast();
  return useMutation({
    mutationFn: (data: createAddition) => createAdditions(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: additionsKeys.list(),
      });
      notifySuccess(response?.message);
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        const res = error?.response?.data;
        console.log(res);
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
