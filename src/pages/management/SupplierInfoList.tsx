import { SupplierInfoListMain } from "../../components/page/Management/SupplierInfoList/SupplierInfoListMain/SupplierInfoListMain";
import { ContentBox } from "../../components/common/ContentBox/ContentBox";
export const SupplierInfoList = () => {
    return (
        <>
            <ContentBox variant='primary' fontSize='large'>
                제품정보
            </ContentBox>
            <SupplierInfoListMain />
        </>
    );
};
