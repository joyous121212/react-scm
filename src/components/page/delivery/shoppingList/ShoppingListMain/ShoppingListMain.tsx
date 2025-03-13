import { useEffect, useState } from "react";
import { delivery } from "../../../../../api/api";
import { deliverySearchApi } from "../../../../../api/DeliveryApi/searchApi";
import { StyledTable, StyledTd, StyledTh } from "../../../../common/styled/StyledTable";
import { useLocation } from "react-router-dom";
import { IShoppingList, IShoppingListBodyResponse } from "../../../../../models/interface/IDelivery";
import { PageNavigate } from "../../../../common/pageNavigation/PageNavigate";
import { useRecoilState } from "recoil";
import { modalState } from "../../../../../stores/modalState";
import { Portal } from "../../../../common/potal/Portal";
import { ShoppingListModal } from "../ShoppingListModal/ShoppingListModal";

export const ShoppingListMain = () => {
    const [shoppingList, setShoppingList] = useState<IShoppingList[]>([]);
    const [listDetail, setListDetail] = useState<IShoppingList>();
    const [modal, setModal] = useRecoilState<boolean>(modalState);
    const [shoppingListCnt, setShoppingListCnt] = useState<number>(0);
    const [cPage, setCPage] = useState<number>(0);
    const { search } = useLocation();

    useEffect(() => {
        searchShoppingList();
    }, [search]);

    const searchShoppingList = async (currentPage?: number) => {
        currentPage = currentPage || 1;
        const searchParam = new URLSearchParams(search);
        searchParam.append("currentPage", currentPage.toString());
        searchParam.append("pageSize", "5");

        const result = await deliverySearchApi<IShoppingListBodyResponse, URLSearchParams>(
            delivery.searchShoppingList,
            searchParam
        );

        console.log(result);
        if (result) {
            setShoppingList(result.shoppingDeliveryList);
            setShoppingListCnt(result.shoppingDeliveryListCnt);
            setCPage(currentPage);
        }
    };

    const changeDeliveryState = () => {
        setModal(!modal);
        // searchShoppingList(cPage);
        setTimeout(() => {
            searchShoppingList(cPage);
        }, 500); // 500ms (0.5초) 딜레이 후 실행
    };

    const handlerModal = (list: IShoppingList) => {
        setModal(!modal);
        setListDetail(list);
    };

    return (
        <>
            <StyledTable>
                <thead>
                    <tr>
                        <StyledTh size={10}>배송번호</StyledTh>
                        <StyledTh size={20}>배송 담당자</StyledTh>
                        <StyledTh size={15}>출발 창고지</StyledTh>
                        <StyledTh size={40}>목적지</StyledTh>
                        <StyledTh size={20}>배송 결과</StyledTh>
                    </tr>
                </thead>
                <tbody>
                    {shoppingList?.length > 0 ? (
                        shoppingList.map((list) => {
                            return (
                                <tr key={list.deliveryId} onClick={() => handlerModal(list)}>
                                    <StyledTd>{list.deliveryId}</StyledTd>
                                    <StyledTd>{list.deliveryManager}</StyledTd>
                                    <StyledTd>{list.startLocation}</StyledTd>
                                    <StyledTd>{list.endLocation}</StyledTd>
                                    <StyledTd>{list.deliveryState}</StyledTd>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <StyledTd colSpan={5}>데이터가 없습니다.</StyledTd>
                        </tr>
                    )}
                </tbody>
            </StyledTable>
            <PageNavigate
                totalItemsCount={shoppingListCnt}
                onChange={searchShoppingList}
                itemsCountPerPage={5}
                activePage={cPage}
            />
            {modal && (
                <Portal>
                    <ShoppingListModal changeDeliveryState={changeDeliveryState} listDetail={listDetail} />
                </Portal>
            )}
        </>
    );
};
