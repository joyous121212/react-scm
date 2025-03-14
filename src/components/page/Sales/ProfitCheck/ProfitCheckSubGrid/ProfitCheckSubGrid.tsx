import { useEffect, useState } from "react";
import { IProfitCheckDetail, IProfitCheckDetailResponse } from "../../../../../models/interface/IProfitCheck"
import { ProfitCheckSubGridStyled } from "./styled"
import { searchApi } from "../../../../../api/SalesApi/searchApi";
import { ProfitCheck } from "../../../../../api/api";
import { useRecoilState } from "recoil";
import { modalState } from "../../../../../stores/modalState";
import { Column, StyledTable } from "../../../../common/StyledTable/StyledTable";
import { StyledButton } from "../../../../common/StyledButton/StyledButton";

export const ProfitCheckSubGrid = ({supplyId}) => {
    const [modal, setModal] = useRecoilState(modalState);
    const [profitCheckDetail, setProfitCheckDetail] = useState<IProfitCheckDetail[]>([]);

    const columns = [
        { key: "supplierName", title: "기업고객명" },
        { key: "productName", title: "제품명" },
        { key: "performance", title: "매출" },
        { key: "returnPrice", title: "반품" },
        { key: "salesDate", title: "거래날짜" },
    ] as Column<IProfitCheckDetail>[];
    
    useEffect(() => {
        searchProfitCheckDetail();
    }, [supplyId]);

    const searchProfitCheckDetail = async() => {
        const result = await searchApi<IProfitCheckDetailResponse>(ProfitCheck.searchDetail, {supplyId});

        if(result) {
            setProfitCheckDetail(result.detailValue);
        }
    }

    return (
        <ProfitCheckSubGridStyled>
            <StyledTable 
                data={profitCheckDetail}
                columns={columns}
                renderCell={(row, column) => {
                    if (column.key === "performance") {
                        return row.performance.toLocaleString("ko-KR");
                    }
                    if (column.key === "returnPrice") {
                        return row.returnPrice.toLocaleString("ko-KR");
                    }
                    return row[column.key as keyof IProfitCheckDetail];
                }}
            />
            <div className="closeButton">
                <StyledButton onClick={() => setModal(!modal)}>취소</StyledButton>
            </div>
        </ProfitCheckSubGridStyled>
    )
}