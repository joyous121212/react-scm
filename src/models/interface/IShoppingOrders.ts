export interface IShoppingOrder {
    count: number;
    customerName: string;
    deliveryManager: string;
    loginID: string;
    orderId: number;
    paymentStatus: number;
    price: number;
    productId: number;
    productName: string;
    productNumber: string;
    quantity: number;
    requestsReturnDate: string;
    returnsDate: string;
    salesDate: string;
    salesState: string;
    sellPrice: number;
    totalPrice: number;
    totalQuantity: number;
    workOrderCount: number;
    // 버튼이 포함된 가상의 필드 추가
    orderActions?: React.ReactNode; // "발주" 버튼이 들어가는 컬럼
    deliveryActions?: React.ReactNode; // "배송" 버튼이 들어가는 컬럼
}

export interface IShoppingOrdersResponse {
    shoppingList: IShoppingOrder[];
    shoppingCnt: number;
}


export interface IShoppingOrdersOrderDetailResponse {
    orderingInstruction : IShoppingOrder
}

