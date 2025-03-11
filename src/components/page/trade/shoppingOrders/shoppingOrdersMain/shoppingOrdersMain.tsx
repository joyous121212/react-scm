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


export const ShoppingOrdersMain = () => {
    const { searchKeyword } = useContext(ShoppingOrdersContext);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [cPage, setCPage] = useState<number>(0);
    const [shoppingOrders, setShoppingOrders] = useState<IShoppingOrder[]>([]);
    const [shoppingOrdersCnt, setShoppingOrdersCnt] = useState<number>(0);
    const [modal, setModal] = useRecoilState(modalState);
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

    const handlerOrderModal = (id: number) => {
        setModal(!modal);
        setShoppingOrdersId(id);
    };

    const handlerDeliveryModal = (id: number) => {
        setModal(!modal);
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
                                return (
                                    <StyledButton size='small' onClick={() => handlerOrderModal(row.orderId)}>
                                        발주
                                    </StyledButton>
                                );
                            }
                            if (column.key === "deliveryActions") {
                                return (
                                    <StyledButton size='small' onClick={() => handlerDeliveryModal(row.orderId)}>
                                        배송
                                    </StyledButton>
                                );
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
        </ShoppingOrdersMainStyled>
    );
};
