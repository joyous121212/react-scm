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
