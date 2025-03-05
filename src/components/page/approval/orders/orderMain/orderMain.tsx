import { useContext, useEffect, useState } from "react";
import { ApprovalOrderMainStyled } from "./styled";
import { ApprovalOrderContext } from "../../../../../api/Provider/approval/ApprovalOrderProvider";
import { useNavigate } from "react-router-dom";
import { searchApi } from "../../../../../api/ApprovalApi/searchApi";
import { Approval } from "../../../../../api/api";
import { IApprovalOrder, IApprovalOrderResponse } from "../../../../../models/interface/IApprovalOrder";
import { Column, StyledTable } from "../../../../common/StyledTable/StyledTable";
import { StyledButton } from "../../../../common/StyledButton/StyledButton";
import { PageNavigate } from "../../../../common/pageNavigation/PageNavigate";

export const ApprovalOrderMain = () => {
    const { searchKeyword } = useContext(ApprovalOrderContext);
    const [approvalOrderCount, setApprovalOrderCount] = useState<number>(0);
    const [cPage, setCPage] = useState<number>(0);
    const [approvalOrderList, setApprovalOrderList] = useState<IApprovalOrder[]>([]);

    const columns = [
        { key: "supplyName", title: "발주업체명", width: "20%" },
        { key: "productName", title: "제품명", width: "20%" },
        { key: "count", title: "수량", width: "10%" },
        { key: "price", title: "금액", width: "15%" },
        { key: "orderDate", title: "구매일자", width: "15%" },
        { key: "actions", title: "", width: "10%" },
    ] as Column<IApprovalOrder>[];

    useEffect(() => {
        searchApprovalOrder();
    }, [searchKeyword]);

    const searchApprovalOrder = async (currentPage?: number) => {
        currentPage = currentPage || 1;

        const result = await searchApi<IApprovalOrderResponse>(Approval.searchOrder, {
            ...searchKeyword,
            currentPage,
            pageSize: 5,
        });

        if (result) {
            setApprovalOrderList(result.orderList);
            setApprovalOrderCount(result.orderCnt);
            setCPage(currentPage);
        }
    };

    return (
        <ApprovalOrderMainStyled>
            <StyledTable
                data={approvalOrderList}
                columns={columns}
                renderAction={(row) => <StyledButton size='small'>승인</StyledButton>}
                renderCell={(row, column) => {
                    if (column.key === "price") {
                        // count * price 계산 후, 원단위로 포맷 (₩)
                        const totalPrice = row.count * row.price;
                        return totalPrice.toLocaleString("ko-KR"); // 한국 원화(KRW) 단위
                    }
                    return row[column.key as keyof IApprovalOrder];
                }}
            />
            <PageNavigate
                totalItemsCount={approvalOrderCount}
                onChange={searchApprovalOrder}
                itemsCountPerPage={5}
                activePage={cPage}
            />
        </ApprovalOrderMainStyled>
    );
};
