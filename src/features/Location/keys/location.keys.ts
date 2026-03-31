export const locationKeys = {
  countries: ["location", "countries"] as const,
  cities: (countryId: number) => ["location", "cities", countryId] as const,
  states: (cityId: number) => ["location", "states", cityId] as const,
};