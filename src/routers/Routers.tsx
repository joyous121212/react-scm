import { RouteObject, createBrowserRouter } from "react-router-dom";
import { CommonCode } from "../../src/pages/management/CommonCode";
import { Login } from "../../src/pages/Login";
import { Notice } from "../../src/pages/management/Notice";
import { DashBoard } from "../components/layout/DashBoard/DashBoard";
import { NotFound } from "../components/common/NotFound/NotFound";
import { DetailCode } from "../pages/management/DetailCode";
import { Shopping } from "../pages/tasks/Shopping";
import { Orders } from "../pages/tasks/Orders";
import { ApprovalOrder } from "../pages/approval/orders";
import { ApprovalShoppingReturn } from "../pages/approval/shoppingReturn";
import { ShoppingReturnList } from "../pages/trade/shoppingReturnList";
import { OrdersReturnList } from "../pages/tasks/OrdersReturnList";
import { ShoppingReturn } from "../pages/tasks/ShoppingReturn";
import { OrdersList } from "../pages/tasks/OrdersList";
import { Inventory } from "../pages/trade/inventory";
import { Cart } from "../pages/mall/Cart";
import { ShoppingOrders } from "../pages/trade/shoppingOrders";
import { ShoppingList } from "../pages/delivery/ShoppingList";
import { ShoppingReturnListDe } from "../pages/delivery/ShoppingReturnList";
import { History } from "../pages/mall/History";
import { HistroyDetail } from "../pages/mall/HistoryDetail";
import { Performance } from "../pages/sales/Performance";
import { Products } from "../pages/mall/Products";
import { TopSales } from "../pages/sales/TopSales";
import { OrdersReturnListDe } from "../pages/delivery/OrdersReturnList";
import { ProfitCheck } from "../pages/sales/ProfitCheck";
import { Main } from "../pages/main/main";
import { UserInfo } from "../pages/management/UserInfo";
const routers: RouteObject[] = [
    { path: "*", element: <NotFound /> },
    { path: "/", element: <Login /> },
    {
        path: "/react",
        element: <DashBoard />,
        children: [
            {
                index: true, // 기본 페이지 설정
                element: <Main />, // 원하는 메인 페이지 컴포넌트
            },
            {
                path: "trade",
                children: [
                    {
                        path: "shopping-return-list",
                        element: <ShoppingReturnList />,
                    },
                    {
                        path: "inventory",
                        element: <Inventory />,
                    },
                    {
                        path: "shopping-orders",
                        element: <ShoppingOrders />,
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
                ],
            },
            {
                path: "tasks",
                children: [
                    {
                        path: "shopping",
                        element: <Shopping />,
                    },
                    {
                        path: "orders",
                        element: <Orders />,
                    },
                    {
                        path: "shopping-return",
                        element: <ShoppingReturn />,
                    },
                    {
                        path: "orders-list",
                        element: <OrdersList />,
                    },
                    {
                        path: "orders-return-list",
                        element: <OrdersReturnList />,
                    },
                ],
            },

            {
                path: "delivery",
                children: [
                    {
                        path: "shopping-list",
                        element: <ShoppingList />,
                    },
                    {
                        path: "shopping-return-list",
                        element: <ShoppingReturnListDe />,
                    },
                    {
                        path: "orders-list",
                        element: <OrdersList />,
                    },
                    {
                        path: "orders-return-list",
                        element: <OrdersReturnListDe />,
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
                    {
                        path: "cart",
                        element: <Cart />,
                    },

                    {
                        path: "history",
                        element: <History />,
                    },
                    {
                        path: "history/:orderId",
                        element: <HistroyDetail />,
                    },
                ],
            },
            {
                path: "sales",
                children: [
                    {
                        path: "performance",
                        element: <Performance />,
                    },
                    {
                        path: "cart",
                        element: <Cart />,
                    },
                    {
                        path: "top-sales",
                        element: <TopSales />,
                    },
                    {
                        path: "profit-check",
                        element: <ProfitCheck />,
                    },
                ],
            },
        ],
    },
];

export const Routers = createBrowserRouter(routers);
