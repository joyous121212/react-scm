import axios, { AxiosResponse } from "axios";
import { IGetRoleResponse } from "../../models/interface/IInquiry";

export const getRoleApi = async <T, D>(api: string) => {
    try {
        const result: any = await axios.post(api);

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
