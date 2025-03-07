import axios, { AxiosResponse } from "axios";
import { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Column, StyledTable } from "../../../../common/StyledTable/StyledTable";
import { PageNavigate } from "../../../../common/pageNavigation/PageNavigate";
import { OrderListContext } from "../../../../../api/Provider/OrderListProvider";
import { searchApi } from "../../../../../api/CommonCodeApi/searchApi";
import { OrderList } from "../../../../../api/api";
import { OrderListMainStyled } from "./styled";

interface IOrdersList {
    orderId: number;
    price: number;
    count: number;
    orderDate: string;
    isApproved: number;
    isPaid: number;
    productName: string;
    productNumber: string;
    supplyName: string;
}

interface IShoppingBodyResponse {
    orderList: IOrdersList[];
    orderCnt: number;
}

interface IPostResponse {
    result: "success" | "fail";
}

export const OrdersListMain = () => {
    const { searchKeyword } = useContext(OrderListContext);
    const { search } = useLocation();
    const [cPage, setCPage] = useState<number>(0);
    const [orderList, setOrderList] = useState<IOrdersList[]>([]);
    const [orderCnt, setOrderCnt] = useState<number>(0);

    const columns = [
        { key: "productNumber", title: "제품번호" },
        { key: "productName", title: "제품명" },
        { key: "supplyName", title: "발주업체명" },
        { key: "orderDate", title: "주문일자" },
        { key: "count", title: "수량" },
    ] as Column<IOrdersList>[];

    useEffect(() => {
        SearchOrdersList();
    }, [searchKeyword]);

    const SearchOrdersList = async (currentPage?: number) => {
        currentPage = currentPage || 1;
        const searchParam = new URLSearchParams(search);

        searchParam.append("currentPage", currentPage.toString());
        searchParam.append("pageSize", "5");

        const result = await searchApi<IShoppingBodyResponse>(OrderList.searchList, {
            ...searchKeyword,
            currentPage,
            pageSize: 5,
        });
        console.log(result);

        if (result) {
            setOrderList(result.orderList);
        }
    };

    const postSuccess = () => {
        SearchOrdersList();
    };

    return (
        <OrderListMainStyled>
            <StyledTable data={orderList} columns={columns} />
            <PageNavigate
                totalItemsCount={orderCnt}
                onChange={SearchOrdersList}
                itemsCountPerPage={5}
                activePage={cPage}
            />
        </OrderListMainStyled>
    );
};
