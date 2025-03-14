import { useRecoilState } from "recoil";
import { modalState } from "../../../../../stores/modalState";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { delivery } from "../../../../../api/api";
import axios from "axios";
import { deliverySearchApi } from "../../../../../api/DeliveryApi/searchApi";
import { IShoppingReturnList, IShoppingReturnListResponse } from "../../../../../models/interface/IDelivery";
import { StyledTable, StyledTd, StyledTh } from "../../../../common/styled/StyledTable";
import { Portal } from "../../../../common/potal/Portal";
import { ShoppingReturnListModalDe } from "../shoppingReturnListModal/shoppingReturnListModal";
import { PageNavigate } from "../../../../common/pageNavigation/PageNavigate";

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

    return (
        <>
            <StyledTable>
                <thead>
                    <tr>
                        <StyledTh size={10}>번호</StyledTh>
                        <StyledTh size={20}>업체명</StyledTh>
                        <StyledTh size={15}>총금액</StyledTh>
                        <StyledTh size={40}>반품처리일</StyledTh>
                        <StyledTh size={20}>처리상태</StyledTh>
                    </tr>
                </thead>
                <tbody>
                    {shoppingRetunrList?.length > 0 ? (
                        shoppingRetunrList.map((list) => {
                            return (
                                <tr key={list.refundId} onClick={() => handlerModal(list.refundId)}>
                                    <StyledTd>{list.refundId}</StyledTd>
                                    <StyledTd>{list.name}</StyledTd>
                                    <StyledTd>{list.totalPrice}</StyledTd>
                                    <StyledTd>{list.returnsRequestDate}</StyledTd>
                                    <StyledTd>임원 승인 완료</StyledTd>
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
        </>
    );
};
