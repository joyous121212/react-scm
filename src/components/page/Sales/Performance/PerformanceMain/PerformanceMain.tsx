import { useContext, useEffect, useState } from "react"
import { searchApi } from "../../../../../api/SalesApi/searchApi";
import { IPerformance, IPerformanceBodyResponse } from "../../../../../models/interface/IPerformance";
import { Sales } from "../../../../../api/api";
import { PerformanceMainStyled } from "./styled";
import { Column, StyledTable } from "../../../../common/StyledTable/StyledTable";
import { PageNavigate } from "../../../../common/pageNavigation/PageNavigate";
import { PerformanceContext } from "../../../../../api/Provider/PerformanceProvider";

export const PerformanceMain = () => {
    const [performance, setPerformance] = useState<IPerformance[]>([]);
    const [supplierCnt, setSupplierCnt] = useState<number>();
    const [cPage, setCPage] = useState<number>(0);
    const {searchKeyword} = useContext(PerformanceContext);

    const columns = [
        { key: "supplierName", title: "기업 고객명", clickable: true},
        { key: "performance", title: "매출액"},
    ] as Column<IPerformance>[];

    useEffect(() => {
        searchPerformance();
    }, [searchKeyword]);

    const searchPerformance = async(currentPage?: number) => {
        currentPage = currentPage || 1;

        const result = await searchApi<IPerformanceBodyResponse>(Sales.searchList, {
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

    return (
        <PerformanceMainStyled>
            <StyledTable 
                data={performance}
                columns={columns}
            />
            <PageNavigate 
                totalItemsCount={supplierCnt}
                onChange={searchPerformance}
                itemsCountPerPage={10}
                activePage={cPage}
            />
        </PerformanceMainStyled>
    )
}