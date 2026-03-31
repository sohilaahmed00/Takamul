import { httpClient } from "@/api/httpClient";
import type { Country, City, State } from "../types/location.types";

export const getCountries = () => httpClient<Country[]>("/Location/countries");
export const getCitiesByCountry = (countryId: number) => httpClient<City[]>(`/Location/countries/${countryId}/cities`);
export const getStatesByCity = (cityId: number) => httpClient<State[]>(`/Location/cities/${cityId}/states`);