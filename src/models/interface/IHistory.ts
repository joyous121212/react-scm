export interface IHistoryList {
    orderId: number;
    productId: number;
    supplyId: number;
    count: number;
    price: number;
    requestedDeliveryDate: string;
    paymentStatus: string;
    salesDate: string;
    salesState: string;
    deliveryState: string;
}

export interface IHistoryListBodyResponse {
    history: IHistoryList[];
    historyCnt: number;
}

export interface IHistoryDetailList {
    orderId: number;
    detailName: string;
    productId: number;
    productName: string;
    supplyId: number;
    count: number;
    price: number;
    salesState: string;
    select?: boolean;
    returnCount?: number;
    totalPrice?: number;
}

export interface IHistoryDetailListBodyResponse {
    historyDetail: IHistoryDetailList[];
    returnResultCount: number;
}