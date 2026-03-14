import { httpClient } from "@/api/httpClient";
import type { GetAllCountriesResponse, GetCitiesWithCountryIdResponse, GetStatesWithCityIdResponse } from "../types/locations.types";

// ===================
// GET
// ===================

export const getAllCountries = () => httpClient<GetAllCountriesResponse>("/Location/countries");
export const getCitiesWithCountryId = (countryId: number) => httpClient<GetCitiesWithCountryIdResponse>(`/Location/countries/${countryId}/cities`);
export const getStatesWithCityId = (cityId: number) => httpClient<GetStatesWithCityIdResponse>(`/Location/cities/${cityId}/states`);

// export const getCategoryClient = (idOrSlug: string | number) =>
//   httpClient<Category>(`/categories/${idOrSlug}`);

// ===================
// MUTATIONS (Dashboard)
// // ===================

// export const createCustomers = (data: createCustomer) =>
//   httpClient<GetAllCustomersResponse>("/Customer", {
//     method: "POST",
//     data,
//   });

// export const updateCategory = (id: number, data: CreateCategory) =>
//   httpClient<CreateResponse>(`/blog/category/${id}`, {
//     method: "PUT",
//     data,
//   });

// export const deleteCategory = (id: number) =>
//   httpClient<void>(`/blog/category/${id}`, {
//     method: "DELETE",
//   });

// export function getCategoryById(id: string | number) {
//   return httpClient<Category>(`/blog/category/${id}`);
// }
