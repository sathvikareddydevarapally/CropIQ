import { filter, create, update, remove, list } from "@/lib/localStore";
export const CommunityPost = { list: (...args) => list("CommunityPost", ...args), filter: (...args) => filter("CommunityPost", ...args), create: (data) => create("CommunityPost", data), update: (id, data) => update("CommunityPost", id, data), delete: (id) => remove("CommunityPost", id) };
