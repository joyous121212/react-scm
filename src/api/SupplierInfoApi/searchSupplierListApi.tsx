import axios, { AxiosResponse } from "axios";
import { IUpdateSupplyDetailRespose } from "../../models/interface/SupplierInfo";

export const searchSupplierListApi = async <T, D>(api: string, param: D) => {
    try {
        const result: AxiosResponse<any> = await axios.post(api, param);

        console.log(result);

        if (result.status === 200) {
            return result.data;
        } else {
            throw new Error(`HTTP Error: ${result.status} - ${result.statusText}`);
        }
    } catch (error) {
        console.error("api 호출 오류 발생", error);
    }
};
