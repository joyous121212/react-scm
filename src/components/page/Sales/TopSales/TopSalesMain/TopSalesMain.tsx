import { useEffect, useState } from "react"
import { TopSales } from "../../../../../api/api"
import { searchApi } from "../../../../../api/SalesApi/searchApi"
import { TopSalesMainStyled } from "./styled"
import { ITopSales, ITopSalesResponse } from "../../../../../models/interface/ITopSales"
import { Column, StyledTable } from "../../../../common/StyledTable/StyledTable"

export const TopSalesMain = () => {
    const [topSales, setTopSales] = useState<ITopSales[]>([]);

    const columns = [
        { key: "currentRank", title: "순위"},
        { key: "supplierName", title: "기업고객명"},
        { key: "performance", title: "매출액"},
    ] as Column<ITopSales>[];

    useEffect(() => {
        searchTopSales();
    }, []);

    const searchTopSales = async(currentPage?: number) => {
        const result = await searchApi<ITopSalesResponse>(TopSales.searchList, {
            currentPage,
            pageSize: 10,
            searchYear: 2025,
            searchMonth: 3,
        });
        if(result) {
            setTopSales(result.topSalesList);
        }
    }
    return (
        <TopSalesMainStyled>
            <StyledTable
                data={topSales}
                columns={columns}
            />
        </TopSalesMainStyled>
    )
}