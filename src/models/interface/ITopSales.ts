export interface ITopSales {
    supplierName: string;
    performance: number | string;
    currentRank: number | string;
    previousRank: number;
}

export interface ITopSalesResponse {
    topSalesList: ITopSales[];
    supplierCnt: number;
}