import { atom } from "recoil";

export const modalState = atom<boolean>({
    key: "modalState",
    default: false,
});

export const selectRowState = atom<boolean>({
    key: "selectRowState",
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

<<<<<<< HEAD
export const performanceState = atom<boolean>({
    key: "performanceState",
    default: false,
});
export const profitCheckState = atom<boolean>({
    key: "profitCheckState",
=======
export const findModalState = atom<boolean>({
    key: "findModalState",
>>>>>>> 8bdf6266c762088b4e944eeebc17d71e0b1b53bd
    default: false,
});

export const inventoryModalState = atom<boolean>({
    key: "inventoryModalState",
    default: false,
});

export const shoppingReturnListModalState = atom<boolean>({
    key: "shoppingReturnListModalState",
    default: false,
});

export const shoppingOrdersModalState = atom<boolean>({
    key: "shoppingOrdersModalState",
    default: false,
});
