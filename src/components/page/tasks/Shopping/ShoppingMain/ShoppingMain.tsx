import { Portal } from "../../../../common/potal/Portal";
import { PageNavigate } from "../../../../common/pageNavigation/PageNavigate";
import { useContext, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { modalState } from "../../../../../stores/modalState";
import { searchApi } from "../../../../../api/ShoppingApi/searchApi";
import { Shopping } from "../../../../../api/api";
import { IShopping, IShoppingBodyResponse } from "../../../../../models/interface/IShopping";
import { ShoppingModal } from "../ShoppingModal/ShoppingModal";
import { ShoppingMainStyled } from "./styled";
import { Column, StyledTable } from "../../../../common/StyledTable/StyledTable";
import { ShoppingContext } from "../../../../../api/Provider/ShoppingProvider";

export const ShoppingMain = () => {
    const { searchKeyword } = useContext(ShoppingContext);
    const [deliveryOrderList, setDeliveryOrderList] = useState<IShopping[]>([]);
    const [cPage, setCPage] = useState<number>(0);
    const [modal, setModal] = useRecoilState<boolean>(modalState);
    const [deliveryOrderCount, setDeliveryOrderCount] = useState<number>(0);
    const [deliveryId, setDeliveryId] = useState<number>(0);

    const columns = [
        { key: "deliveryId", title: "주문번호" },
        { key: "salesDate", title: "주문일자" },
        { key: "customerName", title: "고객기업명" },
        { key: "count", title: "주문개수" },
    ] as Column<IShopping>[];

    useEffect(() => {
        searchShoppingList();
    }, [searchKeyword]);

    const searchShoppingList = async (currentPage?: number) => {
        currentPage = currentPage || 1;
        const result = await searchApi<IShoppingBodyResponse>(Shopping.searchList, {
            ...searchKeyword,
            currentPage,
            pageSize: 5,
        });

        if (result) {
            setDeliveryOrderList(result.deliveryOrderList);
            setDeliveryOrderCount(result.deliveryOrderCnt);
            setCPage(currentPage);
        }
    };

    const handlerModal = (deliveryId: number) => {
        setModal(!modal);
        setDeliveryId(deliveryId);
    };

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
                    <ShoppingModal deliveryId={deliveryId} setDeliveryId={setDeliveryId} />
                </Portal>
            )}
        </ShoppingMainStyled>
    );
};
