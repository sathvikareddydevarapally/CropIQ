import { getUser, updateUser } from "@/lib/localStore";
export const User = {
  me: async () => getUser(),
  updateMyUserData: async (data) => updateUser(data),
};
