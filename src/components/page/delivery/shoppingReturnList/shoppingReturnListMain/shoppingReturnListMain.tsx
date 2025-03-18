import { useRecoilState } from "recoil";
import { modalState } from "../../../../../stores/modalState";
import { useContext, useEffect, useState } from "react";
import { delivery } from "../../../../../api/api";
import { deliverySearchApi } from "../../../../../api/DeliveryApi/searchApi";
import { IShoppingReturnList, IShoppingReturnListResponse } from "../../../../../models/interface/IDelivery";
import { Portal } from "../../../../common/potal/Portal";
import { ShoppingReturnListModalDe } from "../shoppingReturnListModal/shoppingReturnListModal";
import { PageNavigate } from "../../../../common/pageNavigation/PageNavigate";
import { Column, StyledTable } from "../../../../common/StyledTable/StyledTable";
import { ShoppingReturnListStyled } from "./styled";
import { DeliveryContext } from "../../../../../api/Provider/DeliveryProvider";

export const ShoppingReturnListMainDe = () => {
    const [modal, setModal] = useRecoilState<boolean>(modalState);
    const [cPage, setCPage] = useState<number>(0);
    const [shoppingRetunrList, setShoppingReturnList] = useState<IShoppingReturnList[]>([]);
    const [shoppingRetunrListCnt, setShoppingReturnListCnt] = useState<number>();
    const [refundId, setRefundId] = useState(0);
    const { searchKeyword } = useContext(DeliveryContext);

    useEffect(() => {
        searchShoppingReturnList();
    }, [searchKeyword]);

    const searchShoppingReturnList = async (currentPage?: number) => {
        currentPage = currentPage || 1;
        const result = await deliverySearchApi<IShoppingReturnListResponse>(delivery.searchShoppingReturnList, {
            ...searchKeyword,
            currentPage: String(currentPage),
            pageSize: "5",
        });
        if (result) {
            setShoppingReturnList(result.deliveryReturnList);
            setShoppingReturnListCnt(result.deliveryReturnListCnt);
            setCPage(currentPage);
        }
    };

    const handlerModal = (id: number) => {
        setModal(!modal);
        setRefundId(id);
    };

    const changeApproved = () => {
        setModal(!modal);
        searchShoppingReturnList(cPage);
    };

    const columns = [
        { key: "refundId", title: "번호" },
        { key: "name", title: "업체명" },
        { key: "totalPrice", title: "총 금액" },
        { key: "returnsRequestDate", title: "반품처리일" },
        { key: "state", title: "처리상태" },
    ] as Column<IShoppingReturnList>[];

    return (
        <ShoppingReturnListStyled>
            <StyledTable
                data={shoppingRetunrList?.map((item) => ({
                    ...item,
                    state: "임원승인 완료",
                }))}
                columns={columns}
                onRowClick={(row) => handlerModal(row.refundId)}
            />
            <PageNavigate
                totalItemsCount={shoppingRetunrListCnt}
                onChange={searchShoppingReturnList}
                itemsCountPerPage={5}
                activePage={cPage}
            />
            {modal && (
                <Portal>
                    <ShoppingReturnListModalDe refundId={refundId} changeApproved={changeApproved} />
                </Portal>
            )}
        </ShoppingReturnListStyled>
    );
};
