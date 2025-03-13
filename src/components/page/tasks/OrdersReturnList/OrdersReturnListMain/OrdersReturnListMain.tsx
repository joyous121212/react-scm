import { useContext, useEffect, useState } from "react";
import { searchApi } from "../../../../../api/OrdersReturnListApi/searchApi";
import { IOrdersReturnList, IOrdersReturnListResponse } from "../../../../../models/interface/IOrdersReturnList";
import { OrdersReturnList } from "../../../../../api/api";
import { OrdersReturnListContext } from "../../../../../api/Provider/OrdersReturnListProvider";
import { useRecoilState } from "recoil";
import { modalState } from "../../../../../stores/modalState";
import { OrdersReturnListMainStyled } from "./styled";
import { Column, StyledTable } from "../../../../common/StyledTable/StyledTable";
import { PageNavigate } from "../../../../common/pageNavigation/PageNavigate";
import { Portal } from "../../../../common/potal/Portal";
import { OrdersReturnListModal } from "../OrdersReturnListModal/OrdersReturnListModal";

export const OrdersReturnListMain = () => {
    const { searchValue } = useContext(OrdersReturnListContext);
    const [ordersReturnList, setOrdersReturnList] = useState<IOrdersReturnList[]>([]);
    const [ordersRetrunCount, setOrdersReturnCount] = useState<number>(0);
    const [cPage, setCPage] = useState<number>(0);
    const [modal, setModal] = useRecoilState<boolean>(modalState);
    const [orderRequestsId, setOrderRequestsId] = useState<number>(0);

    useEffect(() => {
        console.log(searchValue);
        searchOrdersReturnList();
    }, [searchValue]);

    const searchOrdersReturnList = async (currentPage?: number) => {
        currentPage = currentPage || 1;

        const result = await searchApi<IOrdersReturnListResponse>(OrdersReturnList.searchList, {
            ...searchValue,
            currentPage,
            pageSize: 5,
        });

        if (result) {
            setOrdersReturnList(result.ordersReturnList);
            setOrdersReturnCount(result.ordersReturnListCnt);
            setCPage(currentPage);
        }
    };

    const handlerModal = (orderRequestsId: number) => {
        setModal(!modal);
        setOrderRequestsId(orderRequestsId);
    };

    const postSuccess = () => {
        setModal(!modal);
        searchOrdersReturnList(cPage);
    };

    const columns = [
        { key: "orderRequestsId", title: "반품번호" },
        { key: "supplyName", title: "반품회사" },
        { key: "productName", title: "반품제품" },
        { key: "count", title: "반품수량" },
        { key: "requestsOrderDate", title: "날짜" },
        { key: "isPaid", title: "입금확인" },
    ] as Column<IOrdersReturnList>[];

    return (
        <OrdersReturnListMainStyled>
            <StyledTable
                data={ordersReturnList}
                columns={columns}
                onRowClick={(row) => handlerModal(row.orderRequestsId)}
            />
            <PageNavigate
                totalItemsCount={ordersRetrunCount}
                onChange={searchOrdersReturnList}
                itemsCountPerPage={5}
                activePage={cPage}
            />
            {modal && (
                <Portal>
                    <OrdersReturnListModal
                        orderRequestsId={orderRequestsId}
                        setOrderRequestsId={setOrderRequestsId}
                        postSuccess={postSuccess}
                    />
                </Portal>
            )}
        </OrdersReturnListMainStyled>
    );
};
