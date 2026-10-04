import { filter, create, update, remove, list } from "@/lib/localStore";
export const Crop = { list: (...args) => list("Crop", ...args), filter: (...args) => filter("Crop", ...args), create: (data) => create("Crop", data), update: (id, data) => update("Crop", id, data), delete: (id) => remove("Crop", id) };
