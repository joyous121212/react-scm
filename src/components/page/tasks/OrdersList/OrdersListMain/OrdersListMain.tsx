import { useContext, useEffect, useState } from "react";
import { OrdersList } from "../../../../../api/api";
import { searchApi } from "../../../../../api/OrdersListApi/searchApi";
import { OrdersListContext } from "../../../../../api/Provider/OrdersListProvider";
import { IOrdersList, IOrdersListResponse } from "../../../../../models/interface/IOrdersList";
import { Column, StyledTable } from "../../../../common/StyledTable/StyledTable";
import { OrdersListStyled } from "./styled";
import { PageNavigate } from "../../../../common/pageNavigation/PageNavigate";
import { Portal } from "../../../../common/potal/Portal";
import { useRecoilState } from "recoil";
import { modalState } from "../../../../../stores/modalState";
import { OrdersListModal } from "../OrdersListModal/OrdersListModal";

export const OrdersListMain = () => {
    const { searchKeyword } = useContext(OrdersListContext);
    const [orderList, setOrdersList] = useState<IOrdersList[]>([]);
    const [orderCount, setOrderCount] = useState<number>(0);
    const [modal, setModal] = useRecoilState<boolean>(modalState);
    const [orderId, setOrderId] = useState<number>(0);
    const [cPage, setCPage] = useState<number>(0);

    const columns = [
        { key: "orderId", title: "발주번호" },
        { key: "supplyName", title: "발주회사" },
        { key: "productName", title: "발주제품" },
        { key: "count", title: "발주수량" },
        { key: "orderDate", title: "날짜" },
        { key: "isApproved", title: "임원승인여부" },
        { key: "isPaid", title: "입금확인" },
    ] as Column<IOrdersList>[];

    useEffect(() => {
        searchOrdersList();
    }, [searchKeyword]);

    const searchOrdersList = async (currentPage?: number) => {
        currentPage = currentPage || 1;

        const result = await searchApi<IOrdersListResponse>(OrdersList.searchList, {
            ...searchKeyword,
            currentPage,
            pageSize: 5,
        });
        console.log("API 응답:", result);
        console.log("응답 키 목록:", Object.keys(result));

        if (result) {
            setOrdersList(result.orderList); // 전체 주문 개수 설정
            setOrderCount(result.orderCnt);
            setCPage(currentPage);
        }
    };

    const handlerModal = (orderId: number) => {
        setModal(!modal);
        setOrderId(orderId);
    };

    const postSuccess = () => {
        setModal(!modal);
        searchOrdersList(cPage);
    };

    return (
        <OrdersListStyled>
            <table>
                <thead>
                    <tr>
                        {columns.map((column) => (
                            <th key={column.key}>{column.title}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {orderList.map((row) => (
                        <tr key={row.orderId} onClick={() => handlerModal(row.orderId)}>
                            {columns.map((column) => {
                                // isApproved 컬럼 변환
                                if (column.key === "isApproved") {
                                    return <td key={column.key}>{row.isApproved ? "승인" : "미승인"}</td>;
                                }

                                // isPaid 컬럼 변환
                                if (column.key === "isPaid") {
                                    return <td key={column.key}>{row.isPaid ? "입금" : "미입금"}</td>;
                                }

                                // 나머지 컬럼은 그대로 출력
                                return <td key={column.key}>{row[column.key]}</td>;
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>

            <PageNavigate
                totalItemsCount={orderCount}
                onChange={searchOrdersList}
                itemsCountPerPage={5}
                activePage={cPage}
            />

            {modal && (
                <Portal>
                    <OrdersListModal orderId={orderId} setOrderId={setOrderId} postSuccess={postSuccess} />
                </Portal>
            )}
        </OrdersListStyled>
    );
};
