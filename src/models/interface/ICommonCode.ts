export interface ICommonCode {
    groupIdx: number;
    groupCode: string;
    groupName: string;
    useYn: string;
    createdDate: string;
    author: string;
    note: string;
}

export interface ICommonCodeResponse {
    commonCode: ICommonCode[];
    commonCodeCnt: number;
}

export interface ICommonDetailCode {
    detailIdx: number;
    groupCode: string;
    detailCode: string;
    detailName: string;
    useYn: string;
    author: string;
    createdDate: string;
    note: string;
}

export interface ICommonDetailResponse {
    commonDetailCodeCnt: number;
    commonDetailCode: ICommonDetailCode[];
}
