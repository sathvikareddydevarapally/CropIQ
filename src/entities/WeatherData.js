import { list, filter } from "@/lib/localStore";
export const WeatherData = { list: (...args) => list("WeatherData", ...args), filter: (...args) => filter("WeatherData", ...args) };
