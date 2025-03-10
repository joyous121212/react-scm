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
    detailValue: IInventorySelectBoxDetail;
}

export interface IInventory {
    categoryName: string;
    createdDate: string;
    input: number;
    inventoryId: number;
    output: number;
    productId: number;
    productName: string;
    productNumber: string;
    quantity: number;
    supplyId: number;
    supplyName: string;
    warehouseAddress:string;
    warehouseCode: string;
    warehouseId: number;
    warehouseManager: string;
    warehouseName: string;
}

export interface IInventoryListResponse {
    inventoryList: IInventory[];
    inventoryCnt: number;
}
