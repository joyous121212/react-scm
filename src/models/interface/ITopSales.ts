export interface ITopSales {
    supplierName: string;
    performance: number;
    currentRank: number;
    previousRank: number;
}

export interface ITopSalesResponse {
    topSalesList: ITopSales[];
    supplierCnt: number;
}