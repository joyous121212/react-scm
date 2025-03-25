import { useRecoilState } from "recoil";
import { PerformanceModalStyled } from "./styled"
import { modalState, selectRowState } from "../../../../../stores/modalState";
import { StyledButton } from "../../../../common/StyledButton/StyledButton";
import { searchApi } from "../../../../../api/SalesApi/searchApi";
import { IPerformanceDetailResponse } from "../../../../../models/interface/IPerformance";
import { Performance } from "../../../../../api/api";
import { IPerformanceDetail } from '../../../../../models/interface/IPerformance';
import { useContext, useEffect, useState } from "react";
import { Column, StyledTable } from "../../../../common/StyledTable/StyledTable";
import { PerformanceContext } from "../../../../../api/Provider/PerformanceProvider";

export const PerformanceSubGrid = ({supplyId, clearSelection}) => {
    const [detail, setDetail] = useState<IPerformanceDetail[]>([]);    
    const [selectRow, setSelectRow] = useRecoilState(selectRowState);
    const {setModalId} = useContext(PerformanceContext);

    const columns = [
        { key: "supplierName", title: "기업고객명"},
        { key: "productName", title: "제품명"},
        { key: "performance", title: "매출액"},
        { key: "salesDate", title: "거래날짜"},
    ] as Column<IPerformanceDetail>[];

    useEffect(() => {
        performanceDetail();
    }, [supplyId]);

    const performanceDetail =  async() => {
        try {
            const result = await searchApi<IPerformanceDetailResponse>(
                Performance.searchDetail,
                {supplyId}
            )

            if(result) {
                setDetail(result.detailValue);
            }
        } catch (error) {
            console.error("performanceDetail 오류:", error);
        }
    };

    const modalClose = () => {
        setModalId("");
        setSelectRow(false);
        clearSelection();
    };

    return (
        <PerformanceModalStyled>
            <StyledTable 
                data={detail}
                columns={columns}
                renderCell={(row, column) => {
                    if (column.key === "performance") {
                        return `${row.performance.toLocaleString("ko-KR")}원`;
                    }
                    return row[column.key as keyof IPerformanceDetail];
                }}
                renderNoData={() => {
                    return <span>거래내역이 없습니다.</span>
                }}
                />               
            <div className="closeButton">
                <StyledButton onClick={modalClose}>취소</StyledButton>
            </div>            
        </PerformanceModalStyled>
    )
};