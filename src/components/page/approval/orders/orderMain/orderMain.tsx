import { useContext, useEffect, useState } from "react";
import { ApprovalOrderMainStyled } from "./styled";
import { ApprovalOrderContext } from "../../../../../api/Provider/approval/ApprovalOrderProvider";
import { useNavigate } from "react-router-dom";
import { searchApi } from "../../../../../api/ApprovalApi/searchApi";
import { Approval } from "../../../../../api/api";
import { IApprovalOrderResponse } from "../../../../../models/interface/IApprovalOrder";

export const ApprovalOrderMain = () => {
    const { searchKeyword } = useContext(ApprovalOrderContext);
    const [approvalOrderList, setApprovalOrderList] = useState([]);
    const navigate = useNavigate();

    // const columns = [
    //     { key: "groupIdx", title: "번호" },
    //     { key: "groupCode", title: "그룹코드", clickable: true },
    //     { key: "groupName", title: "그롭코드명" },
    //     { key: "note", title: "그룹코드설명" },
    //     { key: "createdDate", title: "등록일" },
    //     { key: "useYn", title: "사용여부" },
    //     { key: "actions", title: "비고" },
    // ] as Column<ICommonCode>[];

    useEffect(() => {
        searchCommonCode();
    }, [searchKeyword]);

    const searchCommonCode = async (currentPage?: number) => {
        currentPage = currentPage || 1;

        const result = await searchApi<IApprovalOrderResponse>(Approval.searchOrder, {
            ...searchKeyword,
            currentPage,
            pageSize: 5,
        });

        if (result) {
            console.log(result);
        }
    };

    return (
        <ApprovalOrderMainStyled>
            {/* <StyledTable
                data={commonCodeList}
                columns={columns}
                renderAction={(row) => (
                    <StyledButton size='small'>
                        승인
                    </StyledButton>
                )}
                onCellClick={(row, column) => {
                    if (column === "groupCode") {
                        navigate(`${row.groupIdx}`, { state: { groupCode: row.groupCode } });
                    }
                }}
            /> */}
        </ApprovalOrderMainStyled>
    );
};
