import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { UserPlus } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import useToast from "@/hooks/useToast";
import { useCreateEmployee } from "@/features/employees/hooks/useCreateEmployee";
import z from "zod/v3";
import { zodResolver } from "@hookform/resolvers/zod";
import { Employee } from "@/features/employees/types/employees.types";

interface AddEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee?: Employee;
}

const CreateEmployeeSchema = z.object({
  firstName: z.string().min(1, "الإسم مطلوب"),
  mobile: z.string().optional().or(z.literal("")),
});

export default function AddEmployeeModal({ isOpen, onClose, employee }: AddEmployeeModalProps) {
  const { direction } = useLanguage();
  const { notifySuccess, notifyError } = useToast();
  const { mutateAsync: createEmployee, isPending } = useCreateEmployee();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof CreateEmployeeSchema>>({
    resolver: zodResolver(CreateEmployeeSchema),
    defaultValues: {
      firstName: "",
      mobile: "",
    },
  });

  useEffect(() => {
    if (employee) {
      reset({
        firstName: employee.firstName || "",
        mobile: employee.mobile || "",
      });
    } else {
      reset({
        firstName: "",
        mobile: "",
      });
    }
  }, [employee, reset]);

  const onSubmit = async (data: z.infer<typeof CreateEmployeeSchema>) => {
    try {
      const payload = {
        firstName: data.firstName,
        mobile: data.mobile,
      };

      await createEmployee(payload);
      reset();
      onClose();
    } catch (err) {}
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] md:max-w-[1000px] lg:max-w-screen-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-primary">
            <UserPlus size={20} />
            إضافة موظف
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          {/* اسم الموظف */}
          <Controller
            name="firstName"
            control={control}
            render={({ field }) => (
              <Field>
                <FieldLabel>
                  اسم الموظف <span className="text-red-500">*</span>
                </FieldLabel>
                <Input {...field} placeholder="مثال: أحمد محمد" />
                {errors.firstName && <FieldError>{errors.firstName.message}</FieldError>}
              </Field>
            )}
          />

          {/* رقم الجوال */}
          <Controller
            name="mobile"
            control={control}
            render={({ field }) => (
              <Field>
                <FieldLabel>رقم الجوال</FieldLabel>
                <Input {...field} placeholder="مثال: 01012345678" />
                {errors.mobile && <FieldError>{errors.mobile.message}</FieldError>}
              </Field>
            )}
          />
        </form>

        <DialogFooter>
          <Button size="2xl" onClick={handleSubmit(onSubmit)} loading={isPending}>
            إضافة موظف
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
