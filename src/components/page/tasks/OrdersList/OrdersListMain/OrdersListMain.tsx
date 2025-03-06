import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Column, StyledTable } from "../../../../common/StyledTable/StyledTable";
import { StyledTd, StyledTh } from "../../../../common/styled/StyledTable";
import { PageNavigate } from "../../../../common/pageNavigation/PageNavigate";

interface IOrdersList {
    orderId: number;
    price: number;
    count: number;
    orderDate: string;
    isApproved: number;
    isPaid: number;
    productName: number;
    productNumber: number;
    supplyName: number;
}

interface IShoppingBodyResponse {
    orderList: IOrdersList[];
    orderCnt: number;
}

interface IPostResponse {
    result: "success" | "fail";
}

export const OrdersListMain = () => {
    const { search } = useLocation();
    const [cPage, setCPage] = useState<number>(0);
    const [orderList, setOrderList] = useState<IOrdersList[]>([]);
    const [orderCnt, setOrderCnt] = useState<number>(0);
    const [productNumber, setProductNumber] = useState<number>(0);

    useEffect(() => {
        SearchOrdersList();
    }, []);

    const SearchOrdersList = (currentPage?: number) => {
        currentPage = currentPage || 1;
        const searchParam = new URLSearchParams(search);
        searchParam.append("currentPage", currentPage.toString());
        searchParam.append("pageSize", "5");

        axios
            .post("/tasks/orderListBody.do", searchParam)
            .then((res: AxiosResponse<IShoppingBodyResponse>) => {
                console.log(res.data);
                // setOrderList(res.data.orderList);
                // setOrderCnt(res.data.orderCnt);
                // setCPage(currentPage);
            })
            .then((res) => {
                console.log(res);
            });
    };

    const columns = [
        { key: "orderId", title: "주문번호" },
        { key: "productName", title: "상품명" },
        { key: "productNumber", title: "상품번호" },
        { key: "supplyName", title: "공급사명" },
        { key: "price", title: "가격" },
        { key: "count", title: "수량" },
        { key: "orderDate", title: "주문일자" },
        { key: "isApproved", title: "승인여부" },
        { key: "isPaid", title: "결제여부" },
    ] as Column<IOrdersList>[];

    return (
        <>
            <StyledTable data={orderList} columns={columns} />
            <PageNavigate
                totalItemsCount={orderCnt}
                onChange={SearchOrdersList}
                itemsCountPerPage={5}
                activePage={cPage}
            />
        </>
    );
};
