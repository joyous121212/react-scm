export interface IWarehouseInfoCount {
    warehouseInfoCnt: number;
}

export interface IWarehouseInfo {
    warehouseId: number;
    warehouseCode: string;
    name: string;
    manager: string;
    email: string;
    phone: string;
    zipCode: number; // zipCode는 number로 설정
    address: string;
}

export interface ISearchWarehouseInfoList {
    warehouseInfoCnt: IWarehouseInfoCount;
    warehouseInfoList: IWarehouseInfo[];
}

export interface IDetailWareHouse {
    warehouseId: number; // warehouseId는 number
    warehouseCode: number; // warehouseCode는 number
    name: string; // name은 string
    manager: string; // manager는 string
    email: string; // email은 string
    phone: string; // phone은 string
    zipCode: number; // zipCode는 number
    address: string; // address는 string
}

export interface IWarehouseInfoDetailResponse {
    detailValue: IDetailWareHouse;
}

export interface IUpdateWareHouseRequestDTO {
    warehouseId: number;
    warehouseCode: number;
    name: string;
    manager: string;
    email: string;
    emailDomain: null;
    phone: string;
    zipCode: number;
    address: string;
    detailAddress: string;
    empty: string;
    toPhone: string;
}

export interface IPostWareHouseResponse {
    result: "success" | "fail"; // result는 success 또는 fail만 가질 수 있습니다.
}
