export interface IShopping {
    deliveryId: number;
    orderId: number;
    productId: number;
    supplyId: number;
    startLocation: string | null;
    endLocation: string | null;
    deliveryState: string;
    salesDate: string;
    customerName: string;
    count: number;
    productName: string;
    deliveryManager: string;
    paymentStatus: 0 | 1 | null; // 결제 상태 (0: 결제 안 됨, 1: 결제 됨, null 가능)
}

export interface IShoppingBodyResponse {
    deliveryOrderList: IShopping[];
    deliveryOrderCnt: number;
}

interface IPostResponse {
    result: "success" | "fail";
}
