import axios, { AxiosResponse } from "axios";
import { IDuplicUserIdResponse } from "../../models/interface/IUserInfoS";

export const duplicUserIdCheckApi = async <T, D>(api: string, param: D) => {
    try {
        const result: AxiosResponse<IDuplicUserIdResponse> = await axios.post(api, param);

        console.log(result.data);

        if (result.status === 200) {
            return result.data;
        } else {
            throw new Error(`HTTP Error: ${result.status} - ${result.statusText}`);
        }
    } catch (error) {
        console.error("api 호출 오류 발생", error);
    }
};
