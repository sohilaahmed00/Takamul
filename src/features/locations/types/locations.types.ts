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
