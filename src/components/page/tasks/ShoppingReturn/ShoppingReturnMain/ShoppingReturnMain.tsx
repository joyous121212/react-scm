import { useContext, useEffect, useState } from "react";
import { ShoppingReturnContext } from "../../../../../api/Provider/ShoppingReturnProvider";
import { IShoppingReturn, IShoppingReturnBodyResponse } from "../../../../../models/interface/IShoppingReturn";
import { shoppingReturnSearchApi } from "../../../../../api/ShoppingReturnApi/searchApi";
import { ShoppingReturn } from "../../../../../api/api";
import { ShoppingReturnMainStyled } from "./styled";
import { Column, StyledTable } from "../../../../common/StyledTable/StyledTable";
import { PageNavigate } from "../../../../common/pageNavigation/PageNavigate";

export const ShoppingReturnMain = () => {
    const { searchKeyword } = useContext(ShoppingReturnContext);
    const [shoppingReturnList, setShoppingReturnList] = useState<IShoppingReturn[]>([]);
    const [shoppingReturnListCount, setShoppingReturnListCount] = useState<number>(0);
    const [cPage, setCPage] = useState<number>(0);

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
        SearchShoppingReturn();
    }, [searchKeyword]);

    const SearchShoppingReturn = async (currentPage?: number) => {
        currentPage = currentPage || 1;

        const result = await shoppingReturnSearchApi<IShoppingReturnBodyResponse>(ShoppingReturn.searchList, {
            ...searchKeyword,
            currentPage,
            pageSize: 5,
        });

        if (result) {
            setShoppingReturnList(result.shoppingReturnList);
            setShoppingReturnListCount(result.shoppingReturnListCnt);
            setCPage(currentPage);
        }
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
                        <tr key={row.refundId}>
                            {columns.map((column) => {
                                if (column.key === "isApproved") {
                                    // isApproved 값 변환
                                    const approvalStatus = [
                                        "SCM 승인 대기중",
                                        "임원 승인 대기중",
                                        "임원 승인 완료",
                                        "창고 이동 완료",
                                    ];
                                    return <td key={column.key}>{approvalStatus[row.isApproved] || "알 수 없음"}</td>;
                                }
                                return <td key={column.key}>{row[column.key]}</td>;
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
            {/* <StyledTable data={shoppingReturnList} columns={columns} /> */}
            <PageNavigate
                totalItemsCount={shoppingReturnListCount}
                onChange={SearchShoppingReturn}
                itemsCountPerPage={5}
                activePage={cPage}
            />
        </ShoppingReturnMainStyled>
    );
};
