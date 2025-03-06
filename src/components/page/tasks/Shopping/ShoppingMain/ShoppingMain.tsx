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
        console.log(modal);
        searchShoppingList();
    }, [search]);

    const searchShoppingList = async (currentPage?: number) => {
        currentPage = currentPage || 1;
        const searchParam = new URLSearchParams(search); //key,value를 나눠줌
        searchParam.append("currentPage", currentPage.toString());
        searchParam.append("pageSize", "5");

        const result = await shoppingSearchApi<IShoppingBodyResponse, URLSearchParams>(
            Shopping.searchList,
            searchParam
        );

        if (result) {
            setDeliveryOrderList(result.deliveryOrderList);
            setDeliveryOrderCnt(result.deliveryOrderCnt);
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

    return (
        <>
            <StyledTable>
                <thead>
                    <tr>
                        <StyledTh size={10}>주문번호</StyledTh>
                        <StyledTh size={20}>주문일자</StyledTh>
                        <StyledTh size={50}>고객기업명</StyledTh>
                        <StyledTh size={10}>주문개수</StyledTh>
                    </tr>
                </thead>
                <tbody>
                    {deliveryOrderList?.length > 0 ? (
                        deliveryOrderList.map((shopping) => {
                            return (
                                <tr key={shopping.deliveryId} onClick={() => handlerModal(shopping.deliveryId)}>
                                    <StyledTd>{shopping.deliveryId}</StyledTd>
                                    <StyledTd>{shopping.salesDate}</StyledTd>
                                    <StyledTd>{shopping.customerName}</StyledTd>
                                    <StyledTd>{shopping.count}</StyledTd>
                                </tr>
                            );
                        })
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
