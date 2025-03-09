import { atom } from "recoil";

export const modalState = atom<boolean>({
    key: "modalState",
    default: false,
});

export const detailModalState = atom<boolean>({
    key: "detailModalState",
    default: false,
});