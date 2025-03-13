import { useContext, useEffect, useState } from "react"
import { TopSales } from "../../../../../api/api"
import { searchApi } from "../../../../../api/SalesApi/searchApi"
import { TopSalesMainStyled } from "./styled"
import { ITopSales, ITopSalesResponse } from "../../../../../models/interface/ITopSales"
import { Column, StyledTable } from "../../../../common/StyledTable/StyledTable"
import { Bar } from "react-chartjs-2";
import { TopSalesChart } from "../TopSalesChart/TopSalesChart"
import { TopSalesContext } from "../../../../../api/Provider/TopSalesProvider"

export const TopSalesMain = () => {
    const [topSales, setTopSales] = useState<ITopSales[]>([]);
    const { searchKeyword } = useContext(TopSalesContext);

    const columns = [
        { key: "currentRank", title: "순위"},
        { key: "supplierName", title: "기업고객명"},
        { key: "performance", title: "매출액"},
    ] as Column<ITopSales>[];

    useEffect(() => {
        searchTopSales();
    }, [searchKeyword]);

    const searchTopSales = async(currentPage?: number) => {
        const result = await searchApi<ITopSalesResponse>(TopSales.searchList, {
            ...searchKeyword,
            currentPage,
            pageSize: 10,
        });
        if(result) {
            let data = result.topSalesList;

            while (data.length < 10) {
                data.push({
                    currentRank: "-",
                    supplierName: "-",
                    performance: "-",                    
                } as ITopSales)
            }
            setTopSales(result.topSalesList);
        }
    }

    const chartData = topSales.filter(item => item.performance !== "-");

    return (
        
        <TopSalesMainStyled>
            <div className="divTopSalesList">
                <div className="table-container">
                    <StyledTable
                        data={topSales}
                        columns={columns}
                        renderCell={(row, column) => {
                            if (column.key === "performance") {
                                return row.performance.toLocaleString("ko-KR");
                            }
                            return row[column.key as keyof ITopSales];
                        }}
                    />
                </div>
                
                <div className="performanceChart">
                    <TopSalesChart topSales={chartData} />
                </div>   
                
            </div>
        </TopSalesMainStyled>
    )
}