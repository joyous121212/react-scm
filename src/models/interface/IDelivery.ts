import { delivery } from "./../../api/api";
export interface IShoppingList {
    deliveryId: number;
    orderId: number;
    productId: number;
    deliveryManager: string;
    deliveryState: string;
    endLocation: string;
    startLocation: string;
    count: number;
    customerName: string;
    productName: string;
    salesDate: string;
    supplyId: number;
}

export interface IShoppingListBodyResponse {
    shoppingDeliveryList: IShoppingList[];
    shoppingDeliveryListCnt: number;
}

export interface IShoppingListModal {
    count: number;
    customerName: string;
    deliveryId: number;
    deliveryManager: string;
    deliveryState: string;
    endLocation: string;
    orderId: number;
    paymentStatus: number;
    productId: number;
    productName: string;
    salesDate: string;
    startLocation: string;
    supplyId: number;
}

export interface IShoppingListModalresponse {
    shoppingDeliveryModal: IShoppingListModal;
}

export interface IShoppingReturnList {
    count: number;
    input: number;
    isApproved: number;
    name: string;
    orderId: number;
    output: number;
    price: number;
    productId: number;
    quantity: number;
    refundId: number;
    returnsDate: string;
    returnsRequestDate: string;
    supplyId: number;
    totalPrice: number;
    warehouseId: number;
}

export interface IShoppingReturnListResponse {
    deliveryReturnList: IShoppingReturnList[];
    deliveryReturnListCnt: number;
}

export interface IShoppingReturnListModal {
    count: number;
    detailName: string;
    input: number;
    isApproved: number;
    orderId: number;
    output: number;
    price: number;
    productId: number;
    productName: string;
    productNumber: string;
    quantity: number;
    refundId: number;
    supplyId: number;
    supplyName: string;
    totalPrice: number;
    warehouseId: number;
    warehouseName: string;
}

export interface IShoppingReturnListModalResponse {
    deliveryReturnModalList: IShoppingReturnListModal;
}

export interface IOrdersList {
    orderDirectionDate: string;
    supplyId: number;
    supplyName: string;
    totalAmount: number;
}

export interface IOrdersListResponse {
    orderDirectionGroup: IOrdersList[];
    orderDirectionGroupCnt: number;
}

export interface IOrdersListDetail {
    categoryName: string;
    categoryNumber: string;
    count: number;
    orderId: number;
    productId: number;
    productName: string;
    productNumber: string;
    sellPrice: number;
    supplyId: number;
}
export interface IOrdersListDetailResponse {
    orderDirectionDetail: IOrdersListDetail;
    rderDirectionDetailCnt: number;
}

export interface IOrdersInventory {
    warehouseId: string;
    warehouseName: string;
}
