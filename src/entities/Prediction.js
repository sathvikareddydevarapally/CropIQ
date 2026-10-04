import { filter, create, update, remove, list } from "@/lib/localStore";
export const Prediction = { list: (...args) => list("Prediction", ...args), filter: (...args) => filter("Prediction", ...args), create: (data) => create("Prediction", data), update: (id, data) => update("Prediction", id, data), delete: (id) => remove("Prediction", id) };
