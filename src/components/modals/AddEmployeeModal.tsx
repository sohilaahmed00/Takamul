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
  const { mutateAsync: createEmployee } = useCreateEmployee();

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      address: "",
      mobile: "",
      city: "",
      state: "",
      hireDate: "",
      salary: 0,
      department: "",
      position: "",
      branchId: 0,

      userName: "",
      email: "",
      phoneNumber: "",
      password: "",

      roleName: "",
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

      await createEmployee(payload);
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

          <Controller
            name="salary"
            control={control}
            render={({ field }) => (
              <Field>
                <FieldLabel>Salary</FieldLabel>
                <Input type="number" {...field} />
              </Field>
            )}
          />

          <Controller
            name="department"
            control={control}
            render={({ field }) => (
              <Field>
                <FieldLabel>Department</FieldLabel>
                <Input {...field} />
              </Field>
            )}
          />

          <Controller
            name="position"
            control={control}
            render={({ field }) => (
              <Field>
                <FieldLabel>Position</FieldLabel>
                <Input {...field} />
              </Field>
            )}
          />

          <Controller
            name="branchId"
            control={control}
            render={({ field }) => (
              <Field>
                <FieldLabel>Branch ID</FieldLabel>
                <Input type="number" {...field} />
              </Field>
            )}
          />

          <Controller
            name="hireDate"
            control={control}
            render={({ field }) => (
              <Field>
                <FieldLabel>Hire Date</FieldLabel>
                <Input type="date" {...field} />
              </Field>
            )}
          />

          <Controller
            name="city"
            control={control}
            render={({ field }) => (
              <Field>
                <FieldLabel>City</FieldLabel>
                <Input {...field} />
              </Field>
            )}
          />

          <Controller
            name="state"
            control={control}
            render={({ field }) => (
              <Field>
                <FieldLabel>State</FieldLabel>
                <Input {...field} />
              </Field>
            )}
          />

          <Controller
            name="address"
            control={control}
            render={({ field }) => (
              <Field className="col-span-2">
                <FieldLabel>Address</FieldLabel>
                <Input {...field} />
              </Field>
            )}
          />

          {/* User Info */}
          <Controller
            name="userName"
            control={control}
            render={({ field }) => (
              <Field>
                <FieldLabel>User Name</FieldLabel>
                <Input {...field} />
              </Field>
            )}
          />

          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Field>
                <FieldLabel>Email</FieldLabel>
                <Input {...field} />
              </Field>
            )}
          />

          <Controller
            name="phoneNumber"
            control={control}
            render={({ field }) => (
              <Field>
                <FieldLabel>Phone Number</FieldLabel>
                <Input {...field} />
              </Field>
            )}
          />

          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <Field>
                <FieldLabel>Password</FieldLabel>
                <Input type="password" {...field} />
              </Field>
            )}
          />

          <Controller
            name="roleName"
            control={control}
            render={({ field }) => (
              <Field className="col-span-2">
                <FieldLabel>Role</FieldLabel>
                <Input {...field} />
              </Field>
            )}
          />
        </form>

        <DialogFooter>
          <Button onClick={handleSubmit(onSubmit)}>Add Employee</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
