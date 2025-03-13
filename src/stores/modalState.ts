import { atom } from "recoil";

export const modalState = atom<boolean>({
    key: "modalState",
    default: false,
});

export const detailModalState = atom<boolean>({
    key: "detailModalState",
    default: false,
});


export const detailListModalState = atom<boolean>({
    key: "detailListModalState",
    default: false,
});
export const findModalState = atom<boolean>({
    key: "findModalState",
    default: false,
});
