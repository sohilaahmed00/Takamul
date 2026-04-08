export const employeesKeys = {
  all: ["employees"] as const,

  list: () => [...employeesKeys.all, "list"] as const,
  details: (employeeId?: number) => [...employeesKeys.all, "cities", employeeId] as const,
  states: (cityId?: number) => [...employeesKeys.all, "states", cityId] as const,
};
