
export interface Customer {
  id: number;
  customerCode: number;
  customerName: string;
  phone: string;
  mobile: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  taxNumber: string;
  isActive: boolean;
  createdAt: string;
}
export interface Country {
  id: number;
  countryName: string;
}
export interface Country {
  id: number;
  countryName: string;
}
export interface City {
  id: number;
  countryId: number;
  cityName: string;
}
export interface City {
  id: number;
  countryId: number;
  cityName: string;
}
export interface State {
  id: number;
  cityId: number;
  statesName: string;
}

export type GetAllCountriesResponse = Country[];
export type GetCitiesWithCountryIdResponse = City[];
export type GetStatesWithCityIdResponse = State[];
