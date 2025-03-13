export interface IProfitCheck {
    supplyId: number;
    supplierName: string;
    performance: number;
    returnPrice: number;
    profit: number;
}

export interface IProfitCheckResponse {
    profitCheckList: IProfitCheck[];
    supplierCnt: number;
}

export interface IProfitCheckDetail {
    supplyId: number;
    productId: number;
    supplierName: string;
    productName: string;
    performance: number;
    returnPrice: number;
    profit: number;
    salesDate: string;
}

export interface IProfitCheckDetailResponse {
    detailValue: IProfitCheckDetail[];
}