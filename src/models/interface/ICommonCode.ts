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
