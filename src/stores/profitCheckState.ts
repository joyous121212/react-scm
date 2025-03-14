import { atom } from "recoil";

export const profitCheckState = atom<boolean>({
    key: "profitCheckState",
    default: false,
});
export const findProfitCheckState = atom<boolean>({
    key: "findProfitCheckState",
    default: false,
});