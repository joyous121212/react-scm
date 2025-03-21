import { ContentBox } from "../../components/common/ContentBox/ContentBox"
import { HistoryDetailMain } from "../../components/page/Mall/HistoryDetail/HistoryDetailMain/HistoryDetailMain"

export const HistroyDetail = () => {
    return (
        <>
            <ContentBox variant='primary' fontSize='large'>
                주문이력 상세
            </ContentBox>
            <HistoryDetailMain />
        </>
    )
}