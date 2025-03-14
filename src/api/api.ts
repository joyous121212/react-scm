export const Login = {
    login: "/loginProc.do",
};

export const CommonCode = {
    searchList: "/management/commonCodeListBody.do",
    searchDetail: "/management/commonCodeDetailJson.do",
    save: "/management/commonCodeSaveBody.do",
    update: "/management/commonCodeUpdateBody.do",
    delete: "/management/commonCodeDeleteBody.do",
} as const;

export const Notice = {
    search: "/management/noticeListBody.do",
};

export const UserInfo = {
    search: "/management/userInfoListBody.do",
    detailsearch: "/management/detailCodeListBody.do",
    checkDuplicUserId: "/management/check_loginIDBody.do",
    insertUserInfo: "/registerScmBody.do",
    updateUserInfo: "/management/UpdateScmBody.do",
    userInfoDetail: "/management/userInfoDetailBody.do",
};

export const SupplierInfo = {
    searchSupplierList: "/management/supplierListBody.do",
    searchSupplyDetail: "/management/supplyDetailBody.do",
    searchSupplierDetailList: "/management/supplierDetailBody.do",
    updateSupplyDetail: "/management/supplyUpdateBody.do",
    deleteSupplyDetail: "/management/supplyDeleteBody.do",
    recoverSupplyDetail: "/management/supplyRecoveryBody.do",
    saveSupplyDetail: "/management/SupplySaveBody.do",
    idDuplicCheck: "/management/checkLoginIDBody.do",
};

export const ProductInfo = {
    productList: "/management/productListBody.do",
    productDetail: "/management/productDetailBody.do",
    supplierNameList: "/management/supplierNameListBody.do",
    categoryList: "/management/categoryListBody.do",
    deleteFile: "/management/productFileDeleteBody.do",
    updateProductInfo: "/management/productUpdateBody.do",
    saveProductInfo: "/management/productSaveBody.do",
    deleteProductInfo: "/management/productDeleteBody.do",
};

export const WarehouseInfo = {
    warehouseInfoList: "/management/warehouseInfoListBody.do",
    warehouseInfoDetail: "/management/warehouseInfoDetailBody.do",
    warehouseInfoUpdate: "/management/warehouseInfoUpdateBody.do",
    warehouseInfoSave: "/management/warehouseInfoSaveBody.do",
    warehouseInfoDelete: "/management/warehouseInfoDeleteBody.do",
};

export const InquiryInfo = {
    inquiryListBody: "/management/inquiryListBody.do",
    insertInquiry: "/support/inquiryFileSaveBody.do",
    inquiryDetailBody: "/support/inquiryDetailBody.do",
    inquiryFileUpdateBody: "/support/inquiryFileUpdateBody.do",
    inquiryFileDelete: "/support/inquiryFileDeleteBody.do",
};

export const Products = {
    searchList: "/mall/productsListBody.do",
    searchDetail: "/mall/productsDetailBody.do",
    category: "/mall/products/category",
    supplyList: "/mall/products/supplyList",
};

export const Approval = {
    searchOrder: "/approval/orderListBody.do",
    approvalOrder: "/approval/orderApproveUpdateBody.do",
    searchShoppingReturn: "/approval/shoppingReturnListBody.do",
    approvalShoppingReturn: "/approval/shoppingReturnApproveUpdateBody.do",
};

export const ShoppingReturnList = {
    searchList: "/trade/shoppingReturnListBody.do",
    searchModal: "/trade/shoppingReturnListModalBody.do",
    updateMall: "/trade/shoppingReturnUpdateMallBody.do",
};

export const ShoppingOrders = {
    searchList: "/trade/shoppingListBody.do",
    searchOrderDetail: "/trade/orderingInstructionBody.do",
    searchDeliveryDetail: "/trade/deliveryOrderBody.do",
    saveOrders: "/tasks/orderInstructionSaveBody.do",
    saveDelivers: "/tasks/deliveryOrderSaveBody.do",
};

export const OrdersList = {
    searchList: "/tasks/orderListBody.do",
    searchModal: "/tasks/orderDetailJson.do",
    updateIsPaid: "/tasks/orderPaidUpdateBody.do",
    statdUpdate: "/tasks/orderStateUpdateBody.do",
};

export const OrdersReturnList = {
    searchList: "/tasks/orderReturnListBody.do",
    searchModal: "/tasks/ordersReturnModalBody.do",
    returnUpdate: "/tasks/ordersReturnUpdateBody.do",
    updateReturnIsPaid: "/tasks/ordersReturnPaidUpdateBody.do",
};
