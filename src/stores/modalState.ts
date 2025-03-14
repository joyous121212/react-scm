import { atom } from "recoil";

export const modalState = atom<boolean>({
    key: "modalState",
    default: false,
});
export const findModalState = atom<boolean>({
    key: "findModalState",
    default: false,
});

export const performanceState = atom<boolean>({
    key: "performanceState",
    default: false,
});
export const profitCheckState = atom<boolean>({
    key: "profitCheckState",
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
