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

    // 입금확인 버튼 클릭 시 상태 업데이트
    const handlePaymentConfirm = async (e, orderRequestsId) => {
        e.preventDefault(); // 기본 이벤트 방지
        e.stopPropagation();

        console.log("전송할 orderId:", orderRequestsId);

        try {
            const result = await searchApi<IOrdersReturnListResponse>(OrdersReturnList.updateReturnIsPaid, {
                orderRequestsId,
            });
            console.log("입금 확인 API 응답:", result); // 응답 확인

            if (result?.result === "success") {
                // 업데이트 성공 시, 최신 주문 목록 다시 불러오기
                await searchOrdersReturnList(cPage);
            } else {
                console.error("입금 확인 업데이트 실패");
            }
        } catch (error) {
            console.error("입금 확인 처리 중 오류 발생:", error);
        }
    };

    const columns = [
        { key: "orderRequestsId", title: "반품번호" },
        { key: "supplyName", title: "반품회사" },
        { key: "productName", title: "반품제품" },
        { key: "count", title: "반품수량" },
        { key: "requestsOrderDate", title: "날짜" },
        { key: "returnIsPaid", title: "입금확인" },
    ] as Column<IOrdersReturnList>[];

    return (
        <OrdersReturnListMainStyled>
            <table>
                <thead>
                    <tr>
                        {columns.map((column) => (
                            <th key={column.key}>{column.title}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {ordersReturnList.map((row) => (
                        <tr
                            key={row.orderRequestsId}
                            onClick={() => {
                                if (row.returnIsPaid) {
                                    // returnIsPaid가 입금인 경우에만 모달 열기
                                    handlerModal(row.orderRequestsId);
                                }
                            }}
                            className={row.returnIsPaid ? "clickable-row" : ""}
                        >
                            {columns.map((column) => {
                                // returnIsPaid 컬럼 변환
                                if (column.key === "returnIsPaid") {
                                    return (
                                        <td key={column.key}>
                                            {row.returnIsPaid ? (
                                                "입금"
                                            ) : (
                                                <StyledButton
                                                    onClick={(e) => handlePaymentConfirm(e, row.orderRequestsId)}
                                                >
                                                    입금확인
                                                </StyledButton>
                                            )}
                                        </td>
                                    );
                                }

                                return (
                                    <td key={column.key} className={row.returnIsPaid ? "td-pointer" : ""}>
                                        {row[column.key]}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
            {/* <StyledTable
                data={ordersReturnList}
                columns={columns}
                onRowClick={(row) => handlerModal(row.orderRequestsId)}
            /> */}
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
