export interface IPerformance {
    supplyId: number;
    supplierName: string;
}

export interface IPerformanceBodyResponse {
    performanceList: IPerformance[];
    supplierCnt: number;
}

export interface IPerformanceDetail {
    orderId: number;
    supplyId: number;
    productId: number;
    supplierName: string;
    productName: string;
    performance: number
    count: number;
    price: number;
    state: string;
    salesDate: string;
}

export interface IPerformanceDetailResponse {
    detailValue: IPerformanceDetail[];
}