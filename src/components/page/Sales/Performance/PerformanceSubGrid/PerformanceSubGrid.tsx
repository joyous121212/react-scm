import { useRecoilState } from "recoil";
import { PerformanceModalStyled } from "./styled"
import { modalState } from "../../../../../stores/modalState";
import { StyledButton } from "../../../../common/StyledButton/StyledButton";
import { searchApi } from "../../../../../api/SalesApi/searchApi";
import { IPerformanceDetailResponse } from "../../../../../models/interface/IPerformance";
import { Sales } from "../../../../../api/api";
import { IPerformanceDetail } from '../../../../../models/interface/IPerformance';
import { useEffect, useState } from "react";
import { Column, StyledTable } from "../../../../common/StyledTable/StyledTable";

interface IPerformanceModalProps {

}

export const PerformanceModal = ({supplyId}) => {
    const [modal, setModal] = useRecoilState(modalState);
    const [detail, setDetail] = useState<IPerformanceDetail[]>([]);

    const columns = [
        { key: "supplierName", title: "기업고객명"},
        { key: "productName", title: "제품명"},
        { key: "performance", title: "매출액"},
        { key: "salesDate", title: "거래날짜"},
    ] as Column<IPerformanceDetail>[];

    useEffect(() => {
        performanceDetail();
    }, []);

    const performanceDetail =  async() => {
        try {
            const result = await searchApi<IPerformanceDetailResponse>(
                Sales.searchDetail,
                {supplyId}
            )

            if(result) {
                setDetail(result.detailValue);
            }
        } catch (error) {
            console.error("performanceDetail 오류:", error);
        }
    }

    return (
        <PerformanceModalStyled>
            <div className="container">
                <table>
                    <tbody>
                        <tr>
                            <th>기업 고객명</th>
                            <th>제품명</th>
                            <th>매출액</th>
                            <th>거래날짜</th>
                        </tr>
                        {detail.length > 0 ? (
                            detail.map((item) => (
                                <tr key={item.orderId}>
                                    <td>{item.supplierName}</td>
                                    <td>{item.productName}</td>
                                    <td>{item.performance.toLocaleString("ko-KR")}</td>
                                    <td>{item.salesDate}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} style={{ textAlign: "center", padding: "20px" }}>
                                    거래 내역이 없습니다.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>                
                <div className="closeButton">
                    <StyledButton onClick={() => setModal(!modal)}>취소</StyledButton>
                </div>
            </div>
            
        </PerformanceModalStyled>
    )
};