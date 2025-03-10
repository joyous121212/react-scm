export interface IProductDetail {
    productId: "";
    supplyId: "";
    supplier: "";
    productNumber: "";
    name: "";
    sellPrice: "";
    description: "";
    createdDate: "";
    category: "";
    categoryCode: "";
    fileName: "";
    filePath: "";
    logicalPath: "";
    supplyName: "";
    detailName: "";
}
export interface IProductDetailResponse {
    detailValue: IProductDetail;
}
