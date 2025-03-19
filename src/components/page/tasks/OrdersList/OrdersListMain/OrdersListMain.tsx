import { useContext, useEffect, useState } from "react";
import { OrdersList } from "../../../../../api/api";
import { searchApi } from "../../../../../api/OrdersListApi/searchApi";
import { OrdersListContext } from "../../../../../api/Provider/OrdersListProvider";
import { IOrdersList, IOrdersListResponse } from "../../../../../models/interface/IOrdersList";
import { Column, StyledTable } from "../../../../common/StyledTable/StyledTable";
import { OrdersListMainStyled } from "./styled";
import { PageNavigate } from "../../../../common/pageNavigation/PageNavigate";
import { Portal } from "../../../../common/potal/Portal";
import { useRecoilState } from "recoil";
import { modalState } from "../../../../../stores/modalState";
import { OrdersListModal } from "../OrdersListModal/OrdersListModal";
import { StyledButton } from "../../../../common/StyledButton/StyledButton";
import Swal from "sweetalert2";

export const OrdersListMain = () => {
    const { searchKeyword } = useContext(OrdersListContext);
    const [orderList, setOrdersList] = useState<IOrdersList[]>([]);
    const [orderCount, setOrderCount] = useState<number>(0);
    const [modal, setModal] = useRecoilState<boolean>(modalState);
    const [orderId, setOrderId] = useState<number>(0);
    const [cPage, setCPage] = useState<number>(0);
    const [orderState, setOrderState] = useState<string>(" ");

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

        if (result) {
            setOrdersList(result.orderList);
            setOrderCount(result.orderCnt);
            setCPage(currentPage);
        }
    };

    const handlerModal = (orderId: number) => {
        setModal(!modal);
        setOrderId(orderId);
    };

    const handlePaymentConfirm = async (e, orderId) => {
        e.preventDefault();
        e.stopPropagation();

        try {
            const result = await searchApi<IOrdersListResponse>(OrdersList.updateIsPaid, { orderId });

            if (result?.result === "success") {
                await searchOrdersList(cPage);
            }
        } catch (error) {
            console.error("입금 확인 처리 중 오류 발생:", error);
        }
    };

    return (
        <OrdersListMainStyled>
            <StyledTable
                data={orderList}
                columns={columns}
                renderCell={(row, column) => {
                    if (column.key === "isApproved") {
                        return row.isApproved ? "승인" : "미승인";
                    }

                    if (column.key === "isPaid") {
                        return row.isPaid === 0 ? (
                            <StyledButton
                                style={{ whiteSpace: "nowrap" }}
                                onClick={(e) => {
                                    Swal.fire({
                                        icon: "warning",
                                        title: "입금확인 하시겠습니까?",
                                        confirmButtonText: "확인",
                                        showCancelButton: true,
                                    }).then((result) => {
                                        if (result.isConfirmed) {
                                            handlePaymentConfirm(e, row.orderId);
                                        }
                                    });
                                }}
                            >
                                입금확인
                            </StyledButton>
                        ) : (
                            "입금"
                        );
                    }
                    return row[column.key as keyof IOrdersList];
                }}
                onRowClick={(row) => {
                    if (row.isPaid === 1) {
                        handlerModal(row.orderId);
                    }
                }}
            />

            <PageNavigate
                totalItemsCount={orderCount}
                onChange={searchOrdersList}
                itemsCountPerPage={5}
                activePage={cPage}
            />

            {modal && (
                <Portal>
                    <OrdersListModal
                        orderId={orderId}
                        setOrderId={setOrderId}
                        setOrderState={setOrderState}
                        orderState={orderState}
                    />
                </Portal>
            )}
        </OrdersListMainStyled>
    );
};
