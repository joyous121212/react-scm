import { useContext, useEffect, useState } from "react";
import { ShoppingReturnContext } from "../../../../../api/Provider/ShoppingReturnProvider";
import { IShoppingReturn, IShoppingReturnBodyResponse } from "../../../../../models/interface/IShoppingReturn";
import { searchApi } from "../../../../../api/ShoppingReturnApi/searchApi";
import { ShoppingReturn } from "../../../../../api/api";
import { ShoppingReturnMainStyled } from "./styled";
import { Column } from "../../../../common/StyledTable/StyledTable";
import { PageNavigate } from "../../../../common/pageNavigation/PageNavigate";
import { Portal } from "../../../../common/potal/Portal";
import { ShoppingReturnModal } from "../ShoppingReturnModal/ShoppingReturnModal";
import { useRecoilState } from "recoil";
import { modalState } from "../../../../../stores/modalState";

export const ShoppingReturnMain = () => {
    const { searchValue } = useContext(ShoppingReturnContext);
    const [shoppingReturnList, setShoppingReturnList] = useState<IShoppingReturn[]>([]);
    const [shoppingReturnListCount, setShoppingReturnListCount] = useState<number>(0);
    const [cPage, setCPage] = useState<number>(0);
    const [modal, setModal] = useRecoilState<boolean>(modalState);
    const [refundId, setRefundId] = useState<number>(0);

    const columns = [
        { key: "refundId", title: "번호" },
        { key: "productName", title: "제품명" },
        { key: "price", title: "단가" },
        { key: "count", title: "개수" },
        { key: "totalPrice", title: "총금액" },
        { key: "isApproved", title: "처리상태" },
        { key: "returnsRequestDate", title: "날짜" },
    ] as Column<IShoppingReturn>[];

    useEffect(() => {
        searchShoppingReturn();
    }, [searchValue]);

    const searchShoppingReturn = async (currentPage?: number) => {
        currentPage = currentPage || 1;

        const result = await searchApi<IShoppingReturnBodyResponse>(ShoppingReturn.searchList, {
            ...searchValue,
            currentPage,
            pageSize: 5,
        });

        if (result) {
            setShoppingReturnList(result.shoppingReturnList);
            setShoppingReturnListCount(result.shoppingReturnListCnt);
            setCPage(currentPage);
        }
    };

    const handlerModal = (refundId: number) => {
        setModal(!modal);
        setRefundId(refundId);
    };

    return (
        <ShoppingReturnMainStyled>
            <table>
                <thead>
                    <tr>
                        {columns.map((column) => (
                            <th key={column.key}>{column.title}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {shoppingReturnList.map((row) => (
                        <tr onClick={() => handlerModal(row.refundId)} key={row.refundId}>
                            {columns.map((column) => {
                                if (column.key === "isApproved") {
                                    const approvalStatus = [
                                        "SCM 승인 대기중",
                                        "임원 승인 대기중",
                                        "임원 승인 완료",
                                        "창고 이동 완료",
                                    ];
                                    return <td key={column.key}>{approvalStatus[row.isApproved] || "알 수 없음"}</td>;
                                }

                                if (column.key === "price" || column.key === "totalPrice") {
                                    return <td key={column.key}>{`${row[column.key].toLocaleString("ko-KR")}원`}</td>;
                                }

                                return <td key={column.key}>{row[column.key]}</td>;
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
            <PageNavigate
                totalItemsCount={shoppingReturnListCount}
                onChange={searchShoppingReturn}
                itemsCountPerPage={5}
                activePage={cPage}
            />
            {modal && (
                <Portal>
                    <ShoppingReturnModal refundId={refundId} setRefundId={setRefundId} />
                </Portal>
            )}
        </ShoppingReturnMainStyled>
    );
};
