export interface IOrdersReturnList {
    orderRequestsId: number;
    productId: number;
    supplyId: number;
    price: number;
    count: number;
    orderCount: number;
    requestsOrderDate: string;
    isApproved: number;
    isPaid: number;
    orderState: string;
    totalCount: number;
    supplyName: string;
    category: string;
    detailName: string;
    productName: string;
    warehouseId: number;
}

export interface IOrdersReturnListResponse {
    ordersReturnList: IOrdersReturnList[];
    ordersReturnListCnt: number;
    result: string;
}

export interface IOrdersReturnModal extends IOrdersReturnList {
    orderRequestsId: number;
    supplyName: string;
    productName: string;
    productNumber: number;
    count: number;
    requestsOrderDate: string;
    productId: number;
}

export interface IOrdersReturnModalResponse {
    ordersReturnModal: IOrdersReturnModal;
}
