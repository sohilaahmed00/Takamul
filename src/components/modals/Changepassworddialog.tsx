import React from "react";
import { useForm, Controller } from "react-hook-form";
import { KeyRound } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import z from "zod/v3";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUpdateUser } from "@/features/users/hooks/useUpdateUser";
import { useAuthStore } from "@/store/authStore";

// ---------- Schema ----------
const ChangePasswordSchema = z
  .object({
    newPassword: z.string().min(6, "كلمة المرور لازم تكون 6 حروف على الأقل"),
    confirmPassword: z.string().min(1, "تأكيد كلمة المرور مطلوب"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "كلمتا المرور غير متطابقتين",
    path: ["confirmPassword"],
  });

type ChangePasswordFormValues = z.infer<typeof ChangePasswordSchema>;

// ---------- Props ----------
interface ChangePasswordDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

// ---------- Component ----------
export default function ChangePasswordDialog({ isOpen, onClose }: ChangePasswordDialogProps) {
  const { mutateAsync: updateUser, isPending } = useUpdateUser();
  const { userId, userName, email } = useAuthStore();
  console.log(userId);
  const { control, handleSubmit, reset } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues: { newPassword: "", confirmPassword: "" },
  });

  const handleFormSubmit = async (data: ChangePasswordFormValues) => {
    try {
      await updateUser({
        id: Number(userId),
        data: {
          newPassword: data?.newPassword,
          userName: userName,
          email,
        },
      });
      reset();
      onClose();
    } catch {}
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-primary">
            <KeyRound size={20} />
            تغيير كلمة المرور
          </DialogTitle>
        </DialogHeader>

        <form id="changePasswordForm" onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-4">
          <Controller
            name="newPassword"
            control={control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>
                  كلمة المرور الجديدة <span className="text-red-500">*</span>
                </FieldLabel>
                <Input type="password" {...field} placeholder="ادخل كلمة المرور الجديدة" />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name="confirmPassword"
            control={control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>
                  تأكيد كلمة المرور <span className="text-red-500">*</span>
                </FieldLabel>
                <Input type="password" {...field} placeholder="اعد كتابة كلمة المرور الجديدة" />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </form>

        <DialogFooter>
          <Button size="2xl" variant="outline" onClick={onClose} type="button">
            إلغاء
          </Button>
          <Button form="changePasswordForm" loading={isPending} size="2xl" type="submit">
            تغيير كلمة المرور
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
