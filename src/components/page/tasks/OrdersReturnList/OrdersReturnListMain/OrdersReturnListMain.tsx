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
import { StyledButton } from "../../../../common/StyledButton/StyledButton";
import Swal from "sweetalert2";

export const OrdersReturnListMain = () => {
    const { searchValue } = useContext(OrdersReturnListContext);
    const [ordersReturnList, setOrdersReturnList] = useState<IOrdersReturnList[]>([]);
    const [ordersRetrunCount, setOrdersReturnCount] = useState<number>(0);
    const [cPage, setCPage] = useState<number>(0);
    const [modal, setModal] = useRecoilState<boolean>(modalState);
    const [orderRequestsId, setOrderRequestsId] = useState<number>(0);

    const columns = [
        { key: "orderRequestsId", title: "반품번호" },
        { key: "supplyName", title: "반품회사" },
        { key: "productName", title: "반품제품" },
        { key: "count", title: "반품수량" },
        { key: "requestsOrderDate", title: "날짜" },
        { key: "returnIsPaid", title: "입금확인" },
    ] as Column<IOrdersReturnList>[];

    useEffect(() => {
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
        searchOrdersReturnList(cPage);
    };

    const handlePaymentConfirm = async (e, orderRequestsId) => {
        e.preventDefault();
        e.stopPropagation();

        try {
            const result = await searchApi<IOrdersReturnListResponse>(OrdersReturnList.updateReturnIsPaid, {
                orderRequestsId,
            });

            if (result?.result === "success") {
                await searchOrdersReturnList(cPage);
            }
        } catch (error) {
            console.error("입금 확인 처리 중 오류 발생:", error);
        }
    };

    const formatDate = (date: string) => {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = (d.getMonth() + 1).toString().padStart(2, "0");
        const day = d.getDate().toString().padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    return (
        <OrdersReturnListMainStyled>
            <StyledTable
                data={ordersReturnList}
                columns={columns}
                renderCell={(row, column) => {
                    if (column.key === "requestsOrderDate") {
                        return <>{formatDate(row.requestsOrderDate)}</>;
                    }

                    if (column.key === "returnIsPaid") {
                        return (
                            <>
                                {row.returnIsPaid ? (
                                    "입금"
                                ) : (
                                    <StyledButton
                                        onClick={(e) => {
                                            Swal.fire({
                                                icon: "warning",
                                                title: "입금확인 하시겠습니까?",
                                                confirmButtonText: "확인",
                                                showCancelButton: true,
                                            }).then((result) => {
                                                if (result.isConfirmed) {
                                                    handlePaymentConfirm(e, row.orderRequestsId);
                                                }
                                            });
                                        }}
                                    >
                                        입금확인
                                    </StyledButton>
                                )}
                            </>
                        );
                    }

                    return <>{row[column.key]}</>;
                }}
                onRowClick={(row) => {
                    if (row.returnIsPaid) {
                        handlerModal(row.orderRequestsId);
                    }
                }}
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
                        onUpdate={() => searchOrdersReturnList(cPage)}
                    />
                </Portal>
            )}
        </OrdersReturnListMainStyled>
    );
};
