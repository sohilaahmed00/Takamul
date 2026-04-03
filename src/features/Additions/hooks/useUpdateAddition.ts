import { QueryClient, useMutation, useQueryClient } from "@tanstack/react-query";
import useToast from "@/hooks/useToast";
import { updateAddition } from "../services/additions";
import type { createAddition } from "../types/additions.types";
import { additionsKeys } from "../keys/additions.keys";
import axios from "axios";

type UpdateCategoryPayload = {
  id: number;
  data: createAddition;
};

export function useUpdateAddition() {
  const queryClient = useQueryClient();
  const { notifyError, notifySuccess } = useToast();
  return useMutation({
    mutationFn: ({ id, data }: UpdateCategoryPayload) => updateAddition(id, data),
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
