import { useRecoilState } from "recoil";
import { modalState } from "../../../../../stores/modalState";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { delivery } from "../../../../../api/api";
import { deliverySearchApi } from "../../../../../api/DeliveryApi/searchApi";
import { IShoppingReturnList, IShoppingReturnListResponse } from "../../../../../models/interface/IDelivery";
import { Portal } from "../../../../common/potal/Portal";
import { ShoppingReturnListModalDe } from "../shoppingReturnListModal/shoppingReturnListModal";
import { PageNavigate } from "../../../../common/pageNavigation/PageNavigate";
import { Column, StyledTable } from "../../../../common/StyledTable/StyledTable";
import { ShoppingReturnListStyled } from "./styled";

export const ShoppingReturnListMainDe = () => {
    const [modal, setModal] = useRecoilState<boolean>(modalState);
    const [cPage, setCPage] = useState<number>(0);
    const [shoppingRetunrList, setShoppingReturnList] = useState<IShoppingReturnList[]>([]);
    const [shoppingRetunrListCnt, setShoppingReturnListCnt] = useState<number>();
    const [refundId, setRefundId] = useState(0);
    const { search } = useLocation();

    useEffect(() => {
        searchShoppingReturnList();
    }, [search]);

    const searchShoppingReturnList = async (currentPage?: number) => {
        currentPage = currentPage || 1;
        const searchParam = new URLSearchParams(search);
        searchParam.append("currentPage", currentPage.toString());
        searchParam.append("pageSize", "5");

        const result = await deliverySearchApi<IShoppingReturnListResponse, URLSearchParams>(
            delivery.searchShoppingReturnList,
            searchParam
        );
        console.log(result);
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
                data={shoppingRetunrList.map((item) => ({
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
