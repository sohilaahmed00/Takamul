export const locationsKeys = {
  all: ["locations"] as const,

  list: () => [...locationsKeys.all, "list"] as const,
  cities: (countryId?: number) => [...locationsKeys.all, "cities", countryId] as const,
  states: (cityId?: number) => [...locationsKeys.all, "states", cityId] as const,
};
