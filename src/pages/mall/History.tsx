import { HistoryProvider } from "../../api/Provider/HistoryProvider"
import { ContentBox } from "../../components/common/ContentBox/ContentBox"
import { HistoryMain } from "../../components/page/Mall/History/HistoryMain/HistoryMain"
import { HistorySearch } from "../../components/page/Mall/History/HistorySearch/HistorySearch"

export const History = () => {
    return (
        <HistoryProvider>
            <ContentBox variant='primary' fontSize='large'>
                주문이력 조회 & 반품
            </ContentBox>
            <HistorySearch />
            <HistoryMain />
        </HistoryProvider>
    )
}