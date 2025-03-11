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
}
