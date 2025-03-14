import { useEffect, useState } from "react";
import { delivery } from "../../../../../api/api";
import { deliverySearchApi } from "../../../../../api/DeliveryApi/searchApi";
import { useLocation } from "react-router-dom";
import { IShoppingList, IShoppingListBodyResponse } from "../../../../../models/interface/IDelivery";
import { PageNavigate } from "../../../../common/pageNavigation/PageNavigate";
import { useRecoilState } from "recoil";
import { modalState } from "../../../../../stores/modalState";
import { Portal } from "../../../../common/potal/Portal";
import { ShoppingListModal } from "../ShoppingListModal/ShoppingListModal";
import { ShoppingListStyled } from "./styled";
import { Column, StyledTable } from "../../../../common/StyledTable/StyledTable";

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
    const columns = [
        { key: "deliveryId", title: "배송번호" },
        { key: "deliveryManager", title: "배송 담당자" },
        { key: "startLocation", title: "출발 창고지" },
        { key: "endLocation", title: "목적지" },
        { key: "deliveryState", title: "배송 결과" },
    ] as Column<IShoppingList>[];

    return (
        <ShoppingListStyled>
            <StyledTable data={shoppingList} columns={columns} onRowClick={(row) => handlerModal(row)} />
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
        </ShoppingListStyled>
    );
};
