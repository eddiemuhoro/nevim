import { UserType } from "@/types/account.types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserStore {
    user: UserType | null;
}


const userStore = create(
    persist<UserStore>(
        (set) => ({
            user: null,
        }),
        {
            name: "user-store",
        }
    )
);

export default userStore;