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

export const Shopping = {
    searchList: "/tasks/deliveryOrderListBody.do",
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
    searchList: "/mall/cartDetailList.do",
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

export const delivery = {
    searchShoppingList: "/delivery/shoppingDeliveryListJson.do",
    searchShoppingReturnList: "/delivery/deliveryReturnListBody.do",
    searchOrdersList: "/delivery/orderDirectionGroupListBody.do",
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
