import { useContext, useEffect, useState } from "react"
import { searchApi } from "../../../../../api/SalesApi/searchApi";
import { IPerformance, IPerformanceBodyResponse } from "../../../../../models/interface/IPerformance";
import { Performance } from "../../../../../api/api";
import { PerformanceMainStyled } from "./styled";
import { Column, StyledTable } from "../../../../common/StyledTable/StyledTable";
import { PageNavigate } from "../../../../common/pageNavigation/PageNavigate";
import { PerformanceContext } from "../../../../../api/Provider/PerformanceProvider";
import { useRecoilState } from "recoil";
import { modalState } from "../../../../../stores/modalState";
import { Portal } from "../../../../common/potal/Portal";
import { PerformanceSubGrid } from "../PerformanceSubGrid/PerformanceSubGrid";

export const PerformanceMain = () => {
    const [performance, setPerformance] = useState<IPerformance[]>([]);
    const [supplierCnt, setSupplierCnt] = useState<number>();
    const [cPage, setCPage] = useState<number>(0);
    const {searchKeyword} = useContext(PerformanceContext);
    const [modal, setModal] = useRecoilState<boolean>(modalState);
    const [supplyId, setSupplyId] = useState<number>();

    const columns = [
        { key: "supplierName", title: "기업 고객명", clickable: true},
        { key: "performance", title: "매출액"},
    ] as Column<IPerformance>[];

    useEffect(() => {
        searchPerformance();
    }, [searchKeyword]);

    const searchPerformance = async(currentPage?: number) => {
        if (modal) {
            setModal(!modal);
        }
        currentPage = currentPage || 1;

        const result = await searchApi<IPerformanceBodyResponse>(Performance.searchList, {
            ...searchKeyword,
            currentPage,
            pageSize: 10,
        });

        if(result) {
            setPerformance(result.performanceList);
            setSupplierCnt(result.supplierCnt);
            setCPage(currentPage);
        }
    }

    const handlerModal = (id: number) => {
        setSupplyId(id);
        if (!modal) {
            setModal(!modal);
        }
    }

    return (
        <PerformanceMainStyled>
            <StyledTable 
                data={performance}
                columns={columns}
                renderCell={(row, column) => {
                    if (column.key === "supplierName") {
                        return <span style={{ fontWeight: "bold" }}>{row.supplierName}</span>;
                    }
                    if (column.key === "performance") {
                        return `${row.performance.toLocaleString("ko-KR")}원`;
                    }
                    return row[column.key as keyof IPerformance];
                }}
                onCellClick={(row, column) => {
                    if(column === "supplierName") {
                        handlerModal(row.supplyId);
                        setSupplyId(row.supplyId);
                    }
                }}
            />
            <PageNavigate 
                totalItemsCount={supplierCnt}
                onChange={searchPerformance}
                itemsCountPerPage={10}
                activePage={cPage}
            />
            {modal && supplyId !== null && <PerformanceSubGrid supplyId={supplyId}/>}
        </PerformanceMainStyled>
    )
}