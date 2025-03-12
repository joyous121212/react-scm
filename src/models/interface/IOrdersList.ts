export interface IOrdersList {
    orderId: number;
    price: number;
    count: number;
    orderDate: number;
    isApproved: number;
    isPaid: number;
    productName: number;
    productNumber: number;
    supplyName: number;
}

export interface IOrdersListResponse {
    orderList: IOrdersList[];
    orderCnt: number;
    result: string;
}

export interface IOrdersListDetail extends IOrdersList {
    orderId: number;
    supplyName: number;
    productName: number;
    productNumber: number;
    count: number;
}

export interface IOrdersListDetailResponse {
    detailValue: IOrdersListDetail;
    attachmentValue: IOrdersListDetail;
}
