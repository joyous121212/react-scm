import { RouteObject, createBrowserRouter } from "react-router-dom";
import { CommonCode } from "../../src/pages/management/CommonCode";
import { Login } from "../../src/pages/Login";
import { Notice } from "../../src/pages/management/Notice";
import { DashBoard } from "../components/layout/DashBoard/DashBoard";
import { NotFound } from "../components/common/NotFound/NotFound";
import { DetailCode } from "../pages/management/DetailCode";

import { UserInfo } from "../pages/management/UserInfo";
import { SupplierInfo } from "../pages/management/SupplierInfo";
import { SupplierInfoList } from "../pages/management/SupplierInfoList";
import { Products } from "../pages/mall/Products";
import { ApprovalOrder } from "../pages/approval/orders";
import { ApprovalShoppingReturn } from "../pages/approval/shoppingReturn";
import { ShoppingReturnList } from "../pages/trade/shoppingReturnList";
import { ProductInfo } from "../pages/management/ProductInfo";
import { WarehouseInfo } from "../pages/management/WarehouseInfo";
import { Inquiry } from "../pages/management/Inquiry";
const routers: RouteObject[] = [
    { path: "*", element: <NotFound /> },
    { path: "/", element: <Login /> },
    {
        path: "/react",
        element: <DashBoard />,
        children: [
            {
                path: "trade",
                children: [
                    {
                        path: "shopping-return-list",
                        element: <ShoppingReturnList />,
                    },
                ],
            },
            {
                path: "approval",
                children: [
                    {
                        path: "orders",
                        element: <ApprovalOrder />,
                    },
                    {
                        path: "shopping-return",
                        element: <ApprovalShoppingReturn />,
                    },
                ],
            },
            {
                path: "management",
                children: [
                    {
                        path: "notice",
                        element: <Notice />,
                    },
                    {
                        path: "common-code",
                        element: <CommonCode />,
                    },
                    {
                        path: "common-code/:groupIdx",
                        element: <DetailCode />,
                    },
                    {
                        path: "user-info",
                        element: <UserInfo />,
                    },
                    {
                        path: "supplier-info",
                        element: <SupplierInfo />,
                    },
                    {
                        path: "supplier-info/:supplyId",
                        element: <SupplierInfoList />,
                    },
                    {
                        path: "product-info",
                        element: <ProductInfo />,
                    },
                    {
                        path: "warehouse-info",
                        element: <WarehouseInfo />,
                    },
                    {
                        path: "inquiry",
                        element: <Inquiry />,
                    },
                ],
            },
        ],
    },
    {
        path: "/react",
        element: <DashBoard />,
        children: [
            {
                path: "mall",
                children: [
                    {
                        path: "products",
                        element: <Products />,
                    },
                ],
            },
        ],
    },
    {
        path: "/react",
        element: <DashBoard />,
        children: [
            {
                path: "mall",
                children: [
                    {
                        path: "products",
                        element: <Products />,
                    },
                ],
            },
        ],
    },
];

export const Routers = createBrowserRouter(routers);
