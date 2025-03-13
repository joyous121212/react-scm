import { TopSalesProvider } from "../../api/Provider/TopSalesProvider"
import { getApi } from "../../api/SalesApi/getApi"
import { ContentBox } from "../../components/common/ContentBox/ContentBox"
import { TopSalesMain } from "../../components/page/Sales/TopSales/TopSalesMain/TopSalesMain"
import { TopSalesSearch } from "../../components/page/Sales/TopSales/TopSalesSearch/TopSalesSearch"

export const TopSales = () => {    
    return (
        <TopSalesProvider>
            <ContentBox variant='primary' fontSize='large'>
                매출 상위
            </ContentBox>
            <TopSalesSearch />
            <TopSalesMain />
        </TopSalesProvider>
    )
}