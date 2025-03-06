export interface IShoppingReturn {
    count: number;
    isApproved: number;
    name: string;
    price: number;
    productName: string;
    refundId: number;
    returnsRequestDate: string;
    totalPrice: number;
}

export interface IShoppingReturnListResponse {
    shoppingReturnList: IShoppingReturn[];
    shoppingReturnListCnt: number;
}
