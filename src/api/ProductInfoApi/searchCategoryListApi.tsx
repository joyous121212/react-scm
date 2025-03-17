import axios, { AxiosResponse } from "axios";
import { IDeleteSupplyDetailRespose } from "../../models/interface/SupplierInfoS";

export const searchCategoryListApi = async <T, D>(api: string) => {
    try {
        const result: AxiosResponse<any> = await axios.get(api);

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
