import { PerformanceProvider } from "../../api/Provider/PerformanceProvider"
import { ContentBox } from "../../components/common/ContentBox/ContentBox"
import { PerformanceMain } from "../../components/page/Sales/Performance/PerformanceMain/PerformanceMain"
import { PerformanceSearch } from "../../components/page/Sales/Performance/PerformanceSearch/PerformanceSearch"

export const Performance = () => {
    return (
        <PerformanceProvider>
            <ContentBox variant='primary' fontSize='large'>
                매출 현황
            </ContentBox>
            <PerformanceSearch />
            <PerformanceMain />
        </PerformanceProvider>
    )
}