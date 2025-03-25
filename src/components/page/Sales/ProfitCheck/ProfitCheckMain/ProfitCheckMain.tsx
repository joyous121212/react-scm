import { useContext, useEffect, useState } from "react"
import { ProfitCheckMainStyled } from "./styled"
import { IProfitCheck, IProfitCheckResponse } from "../../../../../models/interface/IProfitCheck";
import { searchApi } from "../../../../../api/SalesApi/searchApi";
import { ProfitCheck } from "../../../../../api/api";
import { Column, StyledTable } from "../../../../common/StyledTable/StyledTable";
import { PageNavigate } from "../../../../common/pageNavigation/PageNavigate";
import { ProfitCheckContext } from "../../../../../api/Provider/ProfitCheckProvider";
import { useRecoilState, useResetRecoilState } from "recoil";
import { modalState } from "../../../../../stores/modalState";
import { ProfitCheckSubGrid } from "../ProfitCheckSubGrid/ProfitCheckSubGrid";

export const ProfitCheckMain = () => {
    const [profitCheck, setProfitCheck] = useState<IProfitCheck[]>([]);
    const [supplierCnt, setSupplierCnt] = useState<number>();
    const [cPage, setCPage] = useState<number>(0);
    const {searchKeyword, modalId, setModalId} = useContext(ProfitCheckContext);
    const [supplyId, setSupplyId] = useState<number>();
    const [modal, setModal] = useRecoilState<boolean>(modalState);
    const [selectedSupplyId, setSelectedSupplyId] = useState<number | null>(null);

    const columns = [
        { key: "supplierName", title: "기업명" , clickable: true },
        { key: "performance", title: "매출" },
        { key: "returnPrice", title: "반품" },
        { key: "profit", title: "총손익" },
    ] as Column<IProfitCheck>[];

    useEffect(() => {
        searchProfitCheck();
    }, [searchKeyword]);

    const searchProfitCheck = async(currentPage?: number) => {
        if (modal) {
            setModal(!modal);
        }
        currentPage = currentPage || 1;

        const result = await searchApi<IProfitCheckResponse>(ProfitCheck.searchList, {
            ...searchKeyword,
            currentPage,
            pageSize: 10,
        });

        if(result) {
            setProfitCheck(result.profitCheckList);
            setSupplierCnt(result.supplierCnt);
            setCPage(currentPage);
        }
        
    };

    const handleRowClick = (id: number) => {
        if (selectedSupplyId === id) {
            setSelectedSupplyId(null); // 같은 항목을 누르면 선택 해제
            setSupplyId(undefined);
            setModalId("");
        } else {
            setSelectedSupplyId(id);
            setSupplyId(id);
            setModalId("profitCheck");
        }
    };

    const clearSelection = () => {
        setSelectedSupplyId(null); // 선택 해제
    };

    const profitCheckWithIndex = profitCheck.map((row, index) => ({
        ...row,
        absoluteIndex: (cPage - 1) * 10 + index, // ✅ 페이지를 고려한 절대 인덱스
    }));

    return (
        <ProfitCheckMainStyled>
            <StyledTable
                data={profitCheckWithIndex}
                columns={columns}
                renderCell={(row, column) => {
                    if (column.key === "supplierName") {
                        return (
                            <span 
                                className={row.absoluteIndex === 0 ? "animate-text" : ""} // ✅ index 확인 가능
                                style={{ fontWeight: "bold" }}
                            >
                                {row.absoluteIndex === 0 && <span className="animate-text">👑</span>}
                                {row.supplierName}
                            </span>
                        );
                    }
                    if (column.key === "performance") {
                        return <span className={row.absoluteIndex === 0 ? "animate-text" : ""}>
                                    {row.performance.toLocaleString("ko-KR")}원
                                </span>;
                    }
                    if (column.key === "returnPrice") {
                        return <span className={row.absoluteIndex === 0 ? "animate-text" : ""} style={{ fontWeight: "bold", color: "#F78181" }}>
                                    {row.returnPrice.toLocaleString("ko-KR")}원
                                </span>;
                    }
                    if (column.key === "profit") {
                        return <span className={row.absoluteIndex === 0 ? "animate-text" : ""} style={{ fontWeight: "bold", color: "#4a90e2" }}>
                                    {row.profit.toLocaleString("ko-KR")}원
                                </span>;
                    }
                    return row[column.key as keyof IProfitCheck];
                }}
                onCellClick={(row, column) => {
                    if(column === "supplierName") {
                        handleRowClick(row.supplyId);
                    }
                }}
                getRowClass={(row) => (selectedSupplyId === row.supplyId ? "selected" : "")}
            />
            <PageNavigate 
                totalItemsCount={supplierCnt || 0}
                onChange={searchProfitCheck}
                itemsCountPerPage={10}
                activePage={cPage}
            />
            {(modalId === "profitCheck" && supplyId !== null) && <ProfitCheckSubGrid supplyId={supplyId} clearSelection={clearSelection}/>}
        </ProfitCheckMainStyled>
    )
}