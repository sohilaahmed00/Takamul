// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import * as service from "../services/warehouses";

// export const useGetAllWarehouses = () => 
//   useQuery({ queryKey: ["warehouses"], queryFn: service.getAllWarehouses });

// export const useGetWarehouseById = (id?: number) =>
//   useQuery({ queryKey: ["warehouses", id], queryFn: () => service.getWarehouseById(id!), enabled: !!id });

// export const useCreateWarehouse = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: service.createWarehouse,
//     onSuccess: () => queryClient.invalidateQueries({ queryKey: ["warehouses"] }),
//   });
// };

// export const useUpdateWarehouse = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: ({ id, data }: { id: number; data: any }) => service.updateWarehouse(id, data),
//     onSuccess: () => queryClient.invalidateQueries({ queryKey: ["warehouses"] }),
//   });
// };

// export const useDeleteWarehouse = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: service.deleteWarehouse,
//     onSuccess: () => queryClient.invalidateQueries({ queryKey: ["warehouses"] }),
//   });
// };