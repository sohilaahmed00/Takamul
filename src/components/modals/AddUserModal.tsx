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
import { CreateUser, User } from "@/features/users/types/users.types";
import { useGetAllBranches } from "@/features/Branches/hooks/Usegetallbranches";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useGetAllRoles } from "@/features/roles/hooks/useGetAllRoles";
import { useCreateUser } from "@/features/users/hooks/useCreateUser";
import { useUpdateUser } from "@/features/users/hooks/useUpdateUser";

interface AddEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
}
const getSchema = (isEditMode: boolean) =>
  z
    .object({
      mobile: z.string().optional().or(z.literal("")),
      branchId: z.number().min(1, "الفرع مطلوب"),
      roleName: z.string().min(1, "الصلاحية مطلوبة"),
      email: z.string().min(1, "البريد الإلكتروني مطلوب").email("البريد الإلكتروني غير صحيح"),
      userName: z.string().min(3, "اسم المستخدم لازم يكون 3 حروف على الأقل"),

      password: isEditMode ? z.string().optional() : z.string().min(8, "كلمة المرور لازم تكون 8 حروف على الأقل"),

      confirmPassword: isEditMode ? z.string().optional() : z.string().min(8, "تأكيد كلمة المرور مطلوب"),
    })
    .refine(
      (data) => {
        if (!isEditMode) return data.password === data.confirmPassword;

        if (data.password) return data.password === data.confirmPassword;

        return true;
      },
      {
        message: "كلمتا المرور غير متطابقتين",
        path: ["confirmPassword"],
      },
    );

export default function AddUserModal({ isOpen, onClose, user }: AddEmployeeModalProps) {
  const { direction } = useLanguage();
  const { mutateAsync: createUser, isPending } = useCreateUser();
  const { mutateAsync: updateUser } = useUpdateUser();
  const isEditMode = !!user;
  const { data: branches } = useGetAllBranches();
  const { data: roles } = useGetAllRoles({ page: 1, limit: 100000 });
  type FormData = z.infer<ReturnType<typeof getSchema>>;

  const { control, handleSubmit, reset } = useForm<FormData>({
    resolver: zodResolver(getSchema(isEditMode)),
    defaultValues: {
      branchId: 0,
      mobile: "",
      userName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  useEffect(() => {
    if (user) {
      reset({
        email: user?.email,
        branchId: user?.brunchId,
        mobile: user?.mobile,
        roleName: user?.roleName,
        userName: user?.userName,
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      const payload: CreateUser = {
        employee: {
          firstName: "",
          lastName: "",
          branchId: data?.branchId,
          mobile: data?.mobile,
        },
        user: {
          email: data?.email,
          password: data?.password,
          userName: data?.userName,
        },
        roleName: data?.roleName,
      };
      if (isEditMode) {
        updateUser({
          id: Number(user?.id),
          data: {
            email: data?.email,
            userName: data?.userName,
          },
        });
      } else {
        await createUser(payload);
      }

      reset();
      onClose();
    } catch (error) {}
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] md:max-w-[1000px] lg:max-w-screen-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-primary">
            <UserPlus size={20} />
            {isEditMode ? " تعديل مستخدم" : " إضافة مستخدم"}
          </DialogTitle>
        </DialogHeader>

        <form id="userForm" onSubmit={handleSubmit(onSubmit, (errors) => console.log(errors))} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Controller
            name="userName"
            control={control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>
                  اسم المستخدم <span className="text-red-500">*</span>
                </FieldLabel>
                <Input {...field} placeholder="ادخل اسم المستخدم" />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          {/* الموبايل */}
          <Controller
            name="mobile"
            control={control}
            render={({ field }) => (
              <Field>
                <FieldLabel>رقم الجوال</FieldLabel>
                <Input {...field} placeholder="مثال: 05xxxxxx" />
              </Field>
            )}
          />

          {/* الإيميل */}
          <Controller
            name="email"
            control={control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>
                  البريد الإلكتروني <span className="text-red-500">*</span>
                </FieldLabel>
                <Input {...field} placeholder="example@email.com" />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          {/* الفرع */}
          <Controller
            name="branchId"
            control={control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>
                  الفرع <span className="text-red-500">*</span>
                </FieldLabel>
                <Select value={field.value ? String(field.value) : ""} onValueChange={(value) => field.onChange(Number(value))}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="اختر الفرع" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {branches?.map((c) => (
                        <SelectItem key={c.id} value={String(c.id)}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          {/* الصلاحية */}
          <div className={`${isEditMode ? "col-span-2" : ""}`}>
            <Controller
              name="roleName"
              control={control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>
                    الصلاحية <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Select value={field.value ? String(field.value) : ""} onValueChange={(value) => field.onChange(value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="اختر الصلاحية" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {roles?.items?.map((c) => (
                          <SelectItem key={c.roleId} value={String(c.roleName)}>
                            {c.roleName}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </div>
          {/* الباسورد */}
          {!isEditMode && (
            <Controller
              name="password"
              control={control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>
                    كلمة المرور <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Input type="password" {...field} placeholder="ادخل كلمة المرور" />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          )}

          {/* تأكيد الباسورد */}
          {!isEditMode && (
            <div className="col-span-2">
              <Controller
                name="confirmPassword"
                control={control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>
                      تأكيد كلمة المرور <span className="text-red-500">*</span>
                    </FieldLabel>
                    <Input type="password" {...field} placeholder="اعد كتابة كلمة المرور" />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </div>
          )}
        </form>

        <DialogFooter>
          <Button loading={isPending} size="2xl" form="userForm">
            {isEditMode ? " تعديل مستخدم" : " إضافة مستخدم"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
