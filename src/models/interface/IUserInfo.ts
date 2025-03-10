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

export interface IUserDetialInfo {
    // loginID: string;
    // userType: string;
    // name: string;
    // password: string;
    // sex: string;
    // hp: string;
    // email: string;
    // createdDate: string;
    // birthday: string;
    // userClass: string;
    // statusYn: string;
    // address: string;
    // detailAddress: string;
    // groupCode: string;
    // detailCode: string;
    // manager: string;
    // zipCode: string;
    groupCode:string;
    user_type: string;
    classType: string;
    statusYn: string;
    group_code: string;
    detail_code: string;
    loginID: string;
    password: string;
    password1: string;
    name: string;
    manager: string;
    hp: string;
    userTel1: string;
    userTel2: string;
    userTel3: string;
    birthday: string;
    user_email: string;
    user_zipcode: string;
    user_address: string;
    user_dt_address: string;
    detailCode: string;
    userClass: string;
    sex: string;
    email: string;
    zipCode: string;
    address: string;
    ph: string;
    detailName:string;
    userType:string;
}

export interface IUserInfoDetailResponse {
    detailValue: IUserDetialInfo;
}

export interface UserDetailInfoModalProps {
    LoginId?:string;
    isdetail?: boolean; // 프롭 타입 설정
    // setUserDetail: React.Dispatch<React.SetStateAction<any>>;
}



// 회원가입시키기 요청
export interface requestRegisterScmDto{  
    loginID:string;
    user_type:string;
    name:string;
    password:string;
    gender_cd:string;
    hp:string;
    user_email:string;
    birthday:string;
    classType:string;
    user_zipcode:string;
    user_address:string;
    user_dt_address:string;
    group_code:string;
    detail_code:string;
    manager:string;
}
// 기회원 정보 업데이트
export interface IrequestRegisterUpdateDto{  
  user_type:string;
     name:string;
      password:string;
     gender_cd:string;
     hp:string;
    user_email:string;     
     birthday:string;
    classType:string;
   user_address:string;
      user_dt_address:string;
     group_code:string;
     detail_code:string;
      manager:string;
     user_zipcode:string;
   loginID:string;
}



