export interface IOrdersList {
    orderId: number;
    price: number;
    count: number;
    orderDate: number;
    isApproved: number;
    isPaid: number;
    productName: string;
    productNumber: number;
    supplyName: string;
    orderState: string;
}

export interface IOrdersListResponse {
    orderList: IOrdersList[];
    orderCnt: number;
    result: string;
    isApproved: number;
    orderState: string;
}

export interface IOrdersListDetail extends IOrdersList {
    orderId: number;
    supplyName: string;
    productName: string;
    productNumber: number;
    count: number;
    orderState: string;
}

export interface IOrdersListDetailResponse {
    detailValue: IOrdersListDetail;
    attachmentValue: IOrdersListDetail;
}
