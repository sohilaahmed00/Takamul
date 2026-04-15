import React from "react";
import { useForm, Controller } from "react-hook-form";
import { UserPlus } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import useToast from "@/hooks/useToast";
import { useCreateEmployee } from "@/features/employees/hooks/useCreateEmployee";

interface AddEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddEmployeeModal({ isOpen, onClose }: AddEmployeeModalProps) {
  const { direction } = useLanguage();
  const { notifySuccess, notifyError } = useToast();
  const { mutateAsync: createEmployee, isPending } = useCreateEmployee();

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      mobile: "",
    },
  });

  const onSubmit = async (data: any) => {
    try {
      const payload = {
        employee: {
          firstName: data.firstName,
          lastName: data.lastName,
          address: data.address,
          mobile: data.mobile,
          city: data.city,
          state: data.state,
          hireDate: new Date(data.hireDate).toISOString(),
          salary: Number(data.salary),
          department: data.department,
          position: data.position,
          branchId: Number(data.branchId),
        },
        user: {
          userName: data.userName,
          email: data.email,
          phoneNumber: data.phoneNumber,
          password: data.password,
        },
        roleName: data.roleName,
      };

      // await createEmployee(payload);
      notifySuccess("Employee added successfully");

      reset();
      onClose();
    } catch (err: any) {
      notifyError(err?.message || "Error");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] md:max-w-[1000px] lg:max-w-screen-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-primary">
            <UserPlus size={20} />
            Add Employee
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4">
          {/* Employee Info */}
          <Controller
            name="firstName"
            control={control}
            render={({ field }) => (
              <Field>
                <FieldLabel>First Name</FieldLabel>
                <Input {...field} />
              </Field>
            )}
          />

          <Controller
            name="lastName"
            control={control}
            render={({ field }) => (
              <Field>
                <FieldLabel>Last Name</FieldLabel>
                <Input {...field} />
              </Field>
            )}
          />

          <div className="col-span-2">
            <Controller
              name="mobile"
              control={control}
              render={({ field }) => (
                <Field>
                  <FieldLabel>Mobile</FieldLabel>
                  <Input {...field} />
                </Field>
              )}
            />
          </div>
        </form>

        <DialogFooter>
          <Button onClick={handleSubmit(onSubmit)}>Add Employee</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
