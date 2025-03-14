import { atom } from "recoil";

export const performanceState = atom<boolean>({
    key: "performanceState",
    default: false,
});
export const findPerformanceState = atom<boolean>({
    key: "findPerformanceState",
    default: false,
});