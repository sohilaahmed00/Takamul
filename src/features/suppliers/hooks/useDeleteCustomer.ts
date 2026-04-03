import { useMutation } from "@tanstack/react-query";
import { deleteCustomer } from "@/features/customers/services/customers";

export function useDeleteCustomer() {
  return useMutation({
    mutationFn: (id: number) => deleteCustomer(id),
  });
}
