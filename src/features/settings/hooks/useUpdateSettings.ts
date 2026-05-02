import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateGeneralSettings, updateSiteSettings, updateItemsSettings, updateSalesSettings, updateBarcodeSettings } from "../services/settings";
import { settingsKeys } from "../keys/settings.keys";

export const useUpdateGeneralSettings = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateGeneralSettings,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: settingsKeys.all }),
  });
};

export const useUpdateSiteSettings = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateSiteSettings,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: settingsKeys.all }),
  });
};

export const useUpdateItemsSettings = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateItemsSettings,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: settingsKeys.all }),
  });
};

export const useUpdateSalesSettings = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateSalesSettings,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: settingsKeys.all }),
  });
};

export const useUpdateBarcodeSettings = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateBarcodeSettings,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: settingsKeys.all }),
  });
};
