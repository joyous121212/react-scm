import { ProfitCheckProvider } from "../../api/Provider/ProfitCheckProvider"
import { ContentBox } from "../../components/common/ContentBox/ContentBox"
import { ProfitCheckMain } from "../../components/page/Sales/ProfitCheck/ProfitCheckMain/ProfitCheckMain"
import { ProfitCheckSearch } from "../../components/page/Sales/ProfitCheck/ProfitCheckSearch/ProfitCheckSearch"

export const ProfitCheck = () => {
    return (
        <ProfitCheckProvider>
            <ContentBox variant='primary' fontSize='large'>
                손익 조회
            </ContentBox>
            <ProfitCheckSearch />
            <ProfitCheckMain />
        </ProfitCheckProvider>
    )
}