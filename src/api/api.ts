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

export const DetailCode = {
    searchList: "/management/commonDetailCodeListJson.do",
    searchDetail: "/management/commonDetailCodeDetailBody.do",
    save: "/management/commonDetailCodeSaveBody.do",
    update: "/management/commonDetailCodeUpdateBody.do",
    delete: "/management/commonDetailCodeDeleteBody.do",
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
    inquiryAnsSaveBody: "/management/inquiryAnsSaveBody.do",
    insertInquiry: "/support/inquiryFileSaveBody.do",
    inquiryDetailBody: "/support/inquiryDetailBody.do",
    inquiryFileUpdateBody: "/support/inquiryFileUpdateBody.do",
    inquiryFileDelete: "/support/inquiryFileDeleteBody.do",
    inquiryFileRemove: "/support/inquiryFileRemoveBody.do",
};

export const Shopping = {
    searchList: "/tasks/deliveryOrderListBody.do",
    deliveryDetail: "/tasks/deliveryDetailBody.do",
};
export const Products = {
    searchList: "/mall/productsListBody.do",
    searchDetail: "/mall/productsDetailBody.do",
    category: "/mall/products/category",
    supplyList: "/mall/products/supplyList",
    historySave: "/mall/historySaveBody.do",
    cartDetailSave: "/mall/cartDetailSaveBody.do",
};

export const Cart = {
    searchList: "/mall/cartDetailListBody.do",
    deleteCartDetail: "/mall/cartDetailDeleteBody.do",
    historysSave: "/mall/historysSaveBody.do",
};

export const History = {
    searchList: "/mall/historyListBody.do",
    searchDetail: "/mall/historyDetailBody.do",
    returnSave: "/mall//historyReturnRequestBody.do",
    salesComplete: "/mall/historySalesCompleteBody.do",
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

export const Orders = {
    searchList: "/tasks/orderListBody.do",
    orderDetail: "/tasks/orderDetailJson.do",
};

export const ShoppingReturn = {
    searchList: "/tasks/shoppingReturnOrderListBody.do",
    shoppingReturnDetail: "/tasks/shoppingReturnOrderListDetailBody.do",
};

export const Inventory = {
    searchSelectBoxList: "/trade/inventorySelectBoxBody.do",
    searchList: "/trade/inventoryListBody.do",
    searchDetail: "/trade/inventoryDetailBody.do",
};

export const login = {
    checkLoginId: "/check_loginIDJson.do",
    checkEmail: "/check_emailJson.do",
    checkRegisterId: "/registerIdCheckJson.do",
    findInfoPw: "/selectFindInfoPwJson.do",
    sendMail: "/sendmailJson.do",
    changePwd: "/changePwd.do",
    findInfoId: "/selectFindInfoIdJson.do",
};

export const delivery = {
    searchShoppingList: "/delivery/shoppingDeliveryListJson.do",
    searchShoppingReturnList: "/delivery/deliveryReturnListBody.do",
    searchOrdersList: "/delivery/orderDirectionGroupListBody.do",
    searchOrdersReturnList: "/delivery/orderReturnGroupListBody.do",
};

export const DeliveryShopping = {
    shoppingModal: "/delivery/shoppingDeliveryModalBody.do",
    updateDelivery: "/delivery/updateDeliveryStateBody.do",
    shoppingReturnModal: "/delivery/deliveryReturnModalListBody.do",
    updateInventory: "/delivery/deliveryReturnInsertInventoryBody.do",
};

export const DeliveryOrders = {
    ordersDetial: "/delivery/orderDirectionDetailListBody.do",
    ordersReturnDetail: "/delivery/orderReturnDetailListBody.do",
    updateInventory: "/delivery/returnProductInventoryUpdateBody.do",
};

export const Performance = {
    searchList: "/sales/performanceListBody.do",
    searchDetail: "/sales/performanceDetailBody.do",
};

export const TopSales = {
    selectDate: "/sales/selectDateJson",
    searchList: "/sales/topSalesListBody.do",
};

export const ProfitCheck = {
    searchList: "/sales/profitCheckListBody.do",
    searchDetail: "/sales/profitCheckDetailBody.do",
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
