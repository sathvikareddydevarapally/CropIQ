import { filter, create, update, remove, list } from "@/lib/localStore";
export const SoilAnalysis = { list: (...args) => list("SoilAnalysis", ...args), filter: (...args) => filter("SoilAnalysis", ...args), create: (data) => create("SoilAnalysis", data), update: (id, data) => update("SoilAnalysis", id, data), delete: (id) => remove("SoilAnalysis", id) };
