import axios, { AxiosResponse } from "axios";
import { Modal } from "react-bootstrap";
import { Portal } from "../../../../common/potal/Portal";
import { PageNavigate } from "../../../../common/pageNavigation/PageNavigate";

import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useRecoilState } from "recoil";
import { modalState } from "../../../../../stores/modalState";
import { searchApi } from "../../../../../api/ShoppingApi/searchApi";
import { Shopping } from "../../../../../api/api";
import { IShopping, IShoppingBodyResponse } from "../../../../../models/interface/IShopping";
import { ShoppingModal } from "../ShoppingModal/ShoppingModal";
import { ShoppingMainStyled } from "./styled";
import { Column, StyledTable } from "../../../../common/StyledTable/StyledTable";

export const ShoppingMain = () => {
    const { search } = useLocation();
    const [deliveryOrderList, setDeliveryOrderList] = useState<IShopping[]>([]);
    const [cPage, setCPage] = useState<number>(0);
    const [modal, setModal] = useRecoilState<boolean>(modalState);
    const [deliveryOrderCount, setDeliveryOrderCount] = useState<number>(0);
    const [deliveryId, setDeliveryId] = useState<number>(0);

    useEffect(() => {
        searchShoppingList();
    }, [search]);

    const searchShoppingList = async (currentPage?: number) => {
        currentPage = currentPage || 1;
        const searchParam = new URLSearchParams(search); //key,value를 나눠줌
        searchParam.append("currentPage", currentPage.toString());
        searchParam.append("pageSize", "5");

        console.log("전송된 파라미터:", searchParam.toString());

        const result = await searchApi<IShoppingBodyResponse, URLSearchParams>(Shopping.searchList, searchParam);

        console.log("API 호출 결과:", result);

        if (result) {
            // 쿼리 파라미터에서 searchSalesDate 값을 추출
            const searchSalesDate = searchParam.get("searchSalesDate");

            let filteredList = result.deliveryOrderList;

            if (searchSalesDate) {
                // searchSalesDate가 정확히 일치하는 데이터만 필터링
                filteredList = filteredList.filter((item) => {
                    const itemDate = new Date(item.salesDate).toISOString().split("T")[0];
                    return itemDate === searchSalesDate;
                });
            }

            setDeliveryOrderList(filteredList); // 필터링된 리스트 설정
            setDeliveryOrderCount(result.deliveryOrderCnt);
            setCPage(currentPage);
        }
    };

    const handlerModal = (deliveryId: number) => {
        setModal(!modal);
        setDeliveryId(deliveryId);
    };

    const postSuccess = () => {
        setModal(!modal);
        searchShoppingList(cPage);
    };

    const columns = [
        { key: "deliveryId", title: "주문번호" },
        { key: "salesDate", title: "주문일자" },
        { key: "customerName", title: "고객기업명" },
        { key: "count", title: "주문개수" },
    ] as Column<IShopping>[];

    return (
        <ShoppingMainStyled>
            <StyledTable
                data={deliveryOrderList}
                columns={columns}
                onRowClick={(row) => handlerModal(row.deliveryId)}
            />
            <PageNavigate
                totalItemsCount={deliveryOrderCount}
                onChange={searchShoppingList}
                itemsCountPerPage={5}
                activePage={cPage}
            />
            {modal && (
                <Portal>
                    <ShoppingModal deliveryId={deliveryId} setDeliveryId={setDeliveryId} postSuccess={postSuccess} />
                </Portal>
            )}
        </ShoppingMainStyled>
    );
};
