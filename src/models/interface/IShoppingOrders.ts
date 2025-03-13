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
    orderingInstruction: IShoppingOrder;
}

export interface IShoppingDeliveryManager {
    address: string;
    birthday: string;
    createdDate: string;
    detailAddress: string;
    detailCode: string;
    email: string;
    groupCode: string;
    hp: string;
    loginID: string;
    manager: string;
    name: string;
    password: string;
    sex: string;
    statusYn: string;
    userClass: string;
    userType: string;
    zipCode: string;
}

export interface IShoppingWarehouse {
    address: string;
    detailAddress: string;
    email: string;
    manager: string;
    name: string;
    phone: string;
    totalProductStock: number;
    warehouseId: number;
    zipCode: string;
}

export interface IShoppingOrdersDeliveryDetailResponse {
    deliveryOrder: IShoppingOrder;
    warehouseSelectList: IShoppingWarehouse[];
    deliveryManager: IShoppingDeliveryManager[];
}

export interface ISelectOption {
    label: string;
    value: number | string;
}

export interface IWarehouseValue {
    orderCount: number;
    warehouseId: number;
}

export interface IWarehouseList {
    warehouseId:number;
    warehouseName: string;
    totalProductStock: number;
    orderCount: number;
}
