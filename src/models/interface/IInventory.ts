export interface ISelectOption {
    selectBoxId: number;
    selectBoxName: string;
}

export interface IInventorySelectBoxDetail {
    productList: ISelectOption[];
    supplyList: ISelectOption[];
    warehouseList: ISelectOption[];
}


export interface IInventorySelectBoxResponse {
    detailValue: IInventorySelectBoxDetail
}

