import axios, { AxiosResponse } from "axios";
import { IInsertUserInfoResponse } from "../../models/interface/IUserInfoS";

export const postUserInfoInsertApi = async <T, D>(api: string, param: D) => {
    try {
        const result: AxiosResponse<IInsertUserInfoResponse> = await axios.post(api, param);
        if (result.status === 200) {
            return result.data;
        } else {
            throw new Error(`HTTP Error: ${result.status} - ${result.statusText}`);
        }
    } catch (error) {
        console.error("api 호출 오류 발생", error);
    }
};
