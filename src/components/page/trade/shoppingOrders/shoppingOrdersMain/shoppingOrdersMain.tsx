import { useContext, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { modalState } from "../../../../../stores/modalState";
import { searchApi } from "../../../../../api/CommonCodeApi/searchApi";
import { Column, StyledTable } from "../../../../common/StyledTable/StyledTable";
import { ShoppingOrders } from "../../../../../api/api";
import { PageNavigate } from "../../../../common/pageNavigation/PageNavigate";
import { Portal } from "../../../../common/potal/Portal";
import { ShoppingOrdersMainStyled } from "./styled";
import { IShoppingOrder, IShoppingOrdersResponse } from "../../../../../models/interface/IShoppingOrders";
import { StyledButton } from "../../../../common/StyledButton/StyledButton";
import { ShoppingOrdersContext } from "../../../../../api/Provider/trade/ShoppingOrdersProvider";
import { Spinner } from "../../../../common/Spinner/spinner";
import { ShoppingOrdersOrderModal } from "../shoppingOrdersOrderModal/shoppingOrdersOrderModal";

export const ShoppingOrdersMain = () => {
    const { searchKeyword } = useContext(ShoppingOrdersContext);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [cPage, setCPage] = useState<number>(0);
    const [shoppingOrders, setShoppingOrders] = useState<IShoppingOrder[]>([]);
    const [shoppingOrdersCnt, setShoppingOrdersCnt] = useState<number>(0);
    const [modal, setModal] = useRecoilState(modalState);
    const [modalStatus, setModalStatus] = useState<string>("");
    const [minimumOrderCount, setMinimumOrderCount] = useState<number>(0);
    const [shoppingOrdersId, setShoppingOrdersId] = useState<number>(0);

    const columns = [
        { key: "orderId", title: "주문번호" }, // 6.15%
        { key: "salesDate", title: "주문일자" }, // 9.23%
        { key: "customerName", title: "고객기업명" }, // 9.23%
        { key: "productName", title: "주문제품명" }, // 10%
        { key: "totalQuantity", title: "총재고개수" }, // 8.46%
        { key: "sellPrice", title: "단가" }, // 8.46%
        { key: "count", title: "주문개수" }, // 8.46%
        { key: "totalPrice", title: "금액 합계" }, // 9.23%
        { key: "requestsReturnDate", title: "반품 요청 여부" }, // 8.46%
        { key: "returnsDate", title: "반품 처리 일자" }, // 8.46%
        { key: "deliveryActions", title: "배송 지시서" }, // 8.46%
        { key: "orderActions", title: "발주 지시서" }, // 8.46%
    ] as Column<IShoppingOrder>[];

    useEffect(() => {
        searchShoppingOrders();
    }, [searchKeyword]);

    const searchShoppingOrders = async (currentPage?: number) => {
        currentPage = currentPage || 1;
        setIsLoading(true);

        try {
            const result = await searchApi<IShoppingOrdersResponse>(ShoppingOrders.searchList, {
                ...searchKeyword,
                currentPage,
                pageSize: 5,
            });

            if (result) {
                setShoppingOrders(result.shoppingList);
                setShoppingOrdersCnt(result.shoppingCnt);
                setCPage(currentPage);
            }
        } catch (error) {
            console.error("Error fetching shopping orders:", error);
        } finally {
            setIsLoading(false); // ✅ 로딩 완료
        }
    };

    const handlerOrderModal = (id: number, count: number) => {
        setModal(!modal);
        setMinimumOrderCount(count);
        setModalStatus("order");
        setShoppingOrdersId(id);
    };

    const handlerDeliveryModal = (id: number) => {
        setModal(!modal);
        setModalStatus("delivery");
        setShoppingOrdersId(id);
    };

    const postSuccess = () => {
        setModal(!modal);
        searchShoppingOrders();
    };

    return (
        <ShoppingOrdersMainStyled>
            <div className='table-wrapper'>
                {isLoading ? (
                    <Spinner />
                ) : (
                    <StyledTable
                        data={shoppingOrders}
                        columns={columns}
                        renderCell={(row, column) => {
                            if (column.key === "requestsReturnDate") {
                                return row.requestsReturnDate ? "Y" : "N";
                            }
                            if (column.key === "orderActions") {
                                switch (row.salesState) {
                                    case "ordering":
                                        return row.totalQuantity < row.count ? (
                                            <span style={{ color: "green", fontWeight: "bold" }}>발주 처리</span>
                                        ) : null;

                                    case "salesRequest":
                                        return row.totalQuantity < row.count ? (
                                            <StyledButton
                                                size='small'
                                                variant='secondary'
                                                onClick={() =>
                                                    handlerOrderModal(row.orderId, row.count - row.totalQuantity)
                                                }
                                            >
                                                발주
                                            </StyledButton>
                                        ) : null;

                                    default:
                                        return null; // ✅ 모든 경우에서 null 반환하여 ESLint 오류 방지
                                }
                            }

                            if (column.key === "deliveryActions") {
                                switch (row.salesState) {
                                    case "ordering":
                                    case "salesRequest":
                                        if (row.totalQuantity > row.count) {
                                            return (
                                                <StyledButton
                                                    size='small'
                                                    onClick={() => handlerDeliveryModal(row.orderId)}
                                                >
                                                    배송
                                                </StyledButton>
                                            );
                                        }
                                        break;

                                    case "delivery":
                                        return <span style={{ color: "green", fontWeight: "bold" }}>배송중</span>;

                                    case "deliveryComplete":
                                        return <span style={{ color: "green", fontWeight: "bold" }}>배송완료</span>;

                                    default:
                                        return null; // ✅ 모든 경우에서 null 반환하여 ESLint 오류 방지
                                }
                            }

                            return row[column.key as keyof IShoppingOrder];
                        }}
                    />
                )}
            </div>
            <PageNavigate
                totalItemsCount={shoppingOrdersCnt}
                onChange={searchShoppingOrders}
                itemsCountPerPage={5}
                activePage={cPage}
            />
            {
                modal &&
                    (modalStatus === "order" ? (
                        <Portal>
                            <ShoppingOrdersOrderModal
                                shoppingOrderId={shoppingOrdersId}
                                postSuccess={postSuccess}
                                minimumOrderCount={minimumOrderCount}
                            />
                        </Portal>
                    ) : modalStatus === "delivery" ? (
                        <Portal>
                            <ShoppingOrdersOrderModal
                                shoppingOrderId={shoppingOrdersId}
                                postSuccess={postSuccess}
                                minimumOrderCount={minimumOrderCount}
                            />
                        </Portal>
                    ) : null) // ✅ "order" 또는 "delivery"가 아니면 아무것도 렌더링하지 않음
            }
        </ShoppingOrdersMainStyled>
    );
};
