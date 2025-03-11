export interface IPerformance {
    supplyId: number;
    supplierName: string;
}

export interface IPerformanceBodyResponse {
    performanceList: IPerformance[];
    supplierCnt: number;
}