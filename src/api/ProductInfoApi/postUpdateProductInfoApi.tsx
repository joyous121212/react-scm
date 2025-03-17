import axios, { AxiosResponse } from "axios";
import { IPostResultMessageResponse } from "../../models/interface/IProductInfoS";

export const postUpdateProductInfoApi = async <T, D>(api: string, param: D) => {
    try {
        // config 객체로 headers를 전달합니다.
        const result: AxiosResponse<IPostResultMessageResponse> = await axios.post(api, param);
        console.log(result);

        if (result.status === 200) {
            return result.data;
        } else {
            throw new Error(`HTTP Error: ${result.status} - ${result.statusText}`);
        }
    } catch (error) {
        console.error("API 호출 오류 발생", error);
    }
};
