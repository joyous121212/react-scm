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
        console.log(searchKeyword);
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

    // 입금확인 버튼 클릭 시 상태 업데이트
    const handlePaymentConfirm = async (e, orderId) => {
        e.preventDefault(); // 기본 이벤트 방지
        e.stopPropagation();

        console.log("전송할 orderId:", orderId);

        try {
            const result = await searchApi<IOrdersListResponse>(OrdersList.updateIsPaid, { orderId });
            console.log("입금 확인 API 응답:", result); // 응답 확인

            if (result?.result === "success") {
                // 업데이트 성공 시, 최신 주문 목록 다시 불러오기
                await searchOrdersList(cPage);
            } else {
                console.error("입금 확인 업데이트 실패");
            }
        } catch (error) {
            console.error("입금 확인 처리 중 오류 발생:", error);
        }
    };

    return (
        <OrdersListMainStyled>
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
                        <tr
                            key={row.orderId}
                            onClick={() => {
                                if (row.isPaid) {
                                    // isApproved가 승인이고 isPaid가 입금인 경우에만 모달 열기
                                    handlerModal(row.orderId);
                                }
                            }}
                            className={row.isPaid ? "clickable-row" : ""}
                        >
                            {columns.map((column) => {
                                // isApproved 컬럼 변환
                                if (column.key === "isApproved") {
                                    return <td key={column.key}>{row.isApproved ? "승인" : "미승인"}</td>;
                                }

                                // isPaid 컬럼 변환
                                if (column.key === "isPaid") {
                                    return (
                                        <td key={column.key}>
                                            {row.isPaid === 0 ? ( // isPaid가 0이면 무조건 버튼 표시
                                                <StyledButton onClick={(e) => handlePaymentConfirm(e, row.orderId)}>
                                                    입금확인
                                                </StyledButton>
                                            ) : (
                                                "입금"
                                            )}
                                        </td>
                                    );
                                }

                                return (
                                    <td key={column.key} className={row.isApproved && row.isPaid ? "td-pointer" : ""}>
                                        {row[column.key]}
                                    </td>
                                );
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
        </OrdersListMainStyled>
    );
};
