import { useContext, useEffect, useState } from "react";
import { delivery, DeliveryShopping } from "../../../../../api/api";
import { deliverySearchApi } from "../../../../../api/DeliveryApi/searchApi";
import { IShoppingList, IShoppingListBodyResponse, IShoppingState } from "../../../../../models/interface/IDelivery";
import { PageNavigate } from "../../../../common/pageNavigation/PageNavigate";
import { useRecoilState } from "recoil";
import { modalState } from "../../../../../stores/modalState";
import { Portal } from "../../../../common/potal/Portal";
import { ShoppingListModal } from "../ShoppingListModal/ShoppingListModal";
import { ShoppingListStyled } from "./styled";
import { Column, StyledTable } from "../../../../common/StyledTable/StyledTable";
import { DeliveryContext } from "../../../../../api/Provider/DeliveryProvider";
import { deliveryPostApi } from "../../../../../api/DeliveryApi/postApi";
import Swal from "sweetalert2";

export const ShoppingListMain = () => {
    const [shoppingList, setShoppingList] = useState<IShoppingList[]>([]);
    const [listDetail, setListDetail] = useState<IShoppingList>();
    const [modal, setModal] = useRecoilState<boolean>(modalState);
    const [shoppingListCnt, setShoppingListCnt] = useState<number>(0);
    const [cPage, setCPage] = useState<number>(0);
    const { searchKeyword } = useContext(DeliveryContext);

    useEffect(() => {
        searchShoppingList();
    }, [searchKeyword]);

    const searchShoppingList = async (currentPage?: number) => {
        currentPage = currentPage || 1;
        const result = await deliverySearchApi<IShoppingListBodyResponse>(delivery.searchShoppingList, {
            ...searchKeyword,
            currentPage: String(currentPage),
            pageSize: "5",
        });
        if (result) {
            setShoppingList(result.shoppingDeliveryList);
            setShoppingListCnt(result.shoppingDeliveryListCnt);
            setCPage(currentPage);
        }
    };

    const changeDeliveryState = async (data: IShoppingState) => {
        setModal(!modal);
        const result = await deliveryPostApi(DeliveryShopping.updateDelivery, data);
        result ? Swal.fire("배송상태 변경 완료!", "", "success") : Swal.fire("배송상태 변경 실패.", "", "warning");
        searchShoppingList(cPage);
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
