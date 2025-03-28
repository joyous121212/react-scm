export interface IOrders {
    deliveryId: number;
    orderId: number;
    price: number;
    count: number;
    orderDate: string;
    isApproved: number;
    isPaid: number;
    productName: string;
    productNumber: string;
    supplyName: string;
}

export interface IOrdersBodyResponse {
    orderList: IOrders[];
    orderCnt: number;
    result: string;
}

export interface IOrdersDetail extends IOrders {
    orderId: number;
    productNumber: string;
    productName: string;
    supplyName: string;
    orderDate: string;
    count: number;
}

export interface IOrdersDetailResponse {
    detailValue: IOrdersDetail;
    attachmentValue: IOrdersDetail;
}

interface IPostResponse {
    result: "success" | "fail";
}
