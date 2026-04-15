export interface Addition {
  id: number;
  additionNameAr: string | null;
  additionNameEn: string | null;
  additionNameUr: string | null;
  categoryNameUr: string | null;
  isActive: number;
  createdAt: string;
}
export interface CreateUser {
  employee: {
    firstName: string;
    lastName: string;
    address: string;
    mobile: string;
    city: string;
    state: string;
    hireDate: string;
    salary: number;
    department: string;
    position: string;
    branchId: number;
  };
  user: {
    userName: string;
    email: string;
    password: string;
    roleName: string;
  };
  roleName: string;
}

export type GetAllAdditionsResponse = Addition[];
