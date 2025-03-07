import axios, { AxiosResponse } from "axios";
import { StyledTable, StyledTd, StyledTh } from "../../../../common/styled/StyledTable";
import { Modal } from "react-bootstrap";
import { Portal } from "../../../../common/potal/Portal";
import { PageNavigate } from "../../../../common/pageNavigation/PageNavigate";

import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useRecoilState } from "recoil";
import { modalState } from "../../../../../stores/modalState";
import { shoppingSearchApi } from "../../../../../api/ShoppingApi/searchApi";
import { Shopping } from "../../../../../api/api";
import { IShopping, IShoppingBodyResponse } from "../../../../../models/interface/store/IShopping";
import { ShoppingModal } from "../ShoppingModal/ShoppingModal";

export const ShoppingMain = () => {
    const { search } = useLocation();
    const [deliveryOrderList, setDeliveryOrderList] = useState<IShopping[]>([]);
    const [cPage, setCPage] = useState<number>(0);
    const [modal, setModal] = useRecoilState<boolean>(modalState);
    const [deliveryOrderCnt, setDeliveryOrderCnt] = useState<number>(0);
    const [deliveryId, setDeliveryId] = useState<number>(0);

    useEffect(() => {
        searchShoppingList();
    }, [search]);

    const searchShoppingList = async (currentPage?: number) => {
        currentPage = currentPage || 1;
        const searchParam = new URLSearchParams(search); //key,value를 나눠줌
        console.log("searchParam: ", searchParam.toString());
        searchParam.append("currentPage", currentPage.toString());
        searchParam.append("pageSize", "5");

        const result = await shoppingSearchApi<IShoppingBodyResponse, URLSearchParams>(
            Shopping.searchList,
            searchParam
        );

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
            setDeliveryOrderCnt(filteredList.length); // 필터링된 항목 수
            setCPage(currentPage); // 페이지 업데이트
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
        { key: "deliveryId", title: "주문번호", size: 10 },
        { key: "salesDate", title: "주문일자", size: 20 },
        { key: "customerName", title: "고객기업명", size: 50 },
        { key: "count", title: "주문개수", size: 10 },
    ];

    return (
        <>
            <StyledTable>
                <thead>
                    <tr>
                        {columns.map((column) => (
                            <StyledTh key={column.key} size={column.size}>
                                {column.title}
                            </StyledTh>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {deliveryOrderList?.length > 0 ? (
                        deliveryOrderList.map((shopping) => (
                            <tr key={shopping.deliveryId} onClick={() => handlerModal(shopping.deliveryId)}>
                                {columns.map((column) => (
                                    <StyledTd key={column.key}>{shopping[column.key]}</StyledTd>
                                ))}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <StyledTd colSpan={4}>데이터가 없습니다.</StyledTd>
                        </tr>
                    )}
                </tbody>
            </StyledTable>
            {cPage} / {deliveryOrderCnt}
            <PageNavigate
                totalItemsCount={deliveryOrderCnt}
                onChange={searchShoppingList}
                itemsCountPerPage={5}
                activePage={cPage}
            />
            {modal && (
                <Portal>
                    <ShoppingModal deliveryId={deliveryId} setDeliveryId={setDeliveryId} postSuccess={postSuccess} />
                </Portal>
            )}
        </>
    );
};
