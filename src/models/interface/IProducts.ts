export interface IProducts {
    productId: number;
    supplyId: number;
    productNumber: string;
    name: string;
    sellPrice: number;
    description: string;
    categoryName: string;
    supplyName: string;
}

export interface IProductsListBodyResponse {
    products: IProducts[];
    productsCnt: number;
}