import axios, { AxiosResponse } from "axios";
import { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Column, StyledTable } from "../../../../common/StyledTable/StyledTable";
import { PageNavigate } from "../../../../common/pageNavigation/PageNavigate";
import { OrdersContext } from "../../../../../api/Provider/OrdersProvider";
import { searchApi } from "../../../../../api/CommonCodeApi/searchApi";
import { Orders } from "../../../../../api/api";
import { OrdersMainStyled } from "./styled";
import { Portal } from "../../../../common/potal/Portal";
import { useRecoilState } from "recoil";
import { modalState } from "../../../../../stores/modalState";
import { OrdersModal } from "../OrdersModal/OrdersModal";
import { IOrders, IOrdersBodyResponse } from "../../../../../models/interface/IOrders";

export const OrdersMain = () => {
    const { searchKeyword } = useContext(OrdersContext);
    const [cPage, setCPage] = useState<number>(0);
    const [orderList, setOrderList] = useState<IOrders[]>([]);
    const [orderCount, setOrderCount] = useState<number>(0);
    const [modal, setModal] = useRecoilState<boolean>(modalState);
    const [orderId, setOrderId] = useState<number>(0);

    const columns = [
        { key: "productNumber", title: "제품번호" },
        { key: "productName", title: "제품명" },
        { key: "supplyName", title: "발주업체명" },
        { key: "orderDate", title: "주문일자" },
        { key: "count", title: "수량" },
    ] as Column<IOrders>[];

    useEffect(() => {
        searchOrders();
    }, [searchKeyword]);

    const searchOrders = async (currentPage?: number) => {
        currentPage = currentPage || 1;

        const result = await searchApi<IOrdersBodyResponse>(Orders.searchList, {
            ...searchKeyword,
            currentPage,
            pageSize: 5,
        });

        if (result) {
            setOrderList(result.orderList);
            setOrderCount(result.orderCnt);
            setCPage(currentPage);
        }
    };

    const handlerModal = (orderId: number) => {
        setModal(!modal);
        setOrderId(orderId);
    };

    const postSuccess = () => {
        searchOrders();
        searchOrders(cPage);
    };

    return (
        <OrdersMainStyled>
            <StyledTable data={orderList} columns={columns} onRowClick={(row) => handlerModal(row.orderId)} />
            <PageNavigate
                totalItemsCount={orderCount}
                onChange={searchOrders}
                itemsCountPerPage={5}
                activePage={cPage}
            />

            {modal && (
                <Portal>
                    <OrdersModal orderId={orderId} setOrderId={setOrderId} postSuccess={postSuccess} />
                </Portal>
            )}
        </OrdersMainStyled>
    );
};
