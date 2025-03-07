export interface IUserInfo {
    loginID: string;
    userType: string;
    name: string;
    password: string;
    sex: string;
    hp: string;
    email: string;
    createdDate: string;
    birthday: string;
    userClass: string;
    statusYn: string;
    address: string;
    detailAddress: string;
    groupCode: string;
    detailCode: string;
    manager: string;
    zipCode: string;
}
export interface IUserInfoResponse {
    userInfo: IUserInfo[];
    userInfoCnt: number;
}

export interface IDetailCodeList {
    author: any;
    createdDate: any;
    detailCode: string;
    detailIdx: string;
    detailName: string;
    groupCode: string;
    note: string;
    updatedDate: any;
    useYn: any;
}

export interface IDetailCodeListResponse {
    detailCode: IDetailCodeList[];
}

export interface IDuplicUserId {
    duplicCnt: number;
}

export interface IDuplicUserIdResponse {
    duplicCnt: number;
}

export interface IInsertUserInfoResponse {
    result: string;
    resultMsg: string;
}
