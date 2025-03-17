import { SupplierInfoProvider } from "../../api/Provider/SupplierInfoProviderS";
import { SupplierInfoSearch } from "../../components/page/Management/SupplierInfo/SupplierInfoSearch/SupplierInfoSearch";
import { SupplierInfoMain } from "../../components/page/Management/SupplierInfo/SupplierInfoMain/SupplierInfoMain";
import { ContentBox } from "../../components/common/ContentBox/ContentBox";
export const SupplierInfo = () => {
    return (
        <SupplierInfoProvider>
            <ContentBox variant='primary' fontSize='large'>
                납품 업체 정보
            </ContentBox>
            <SupplierInfoSearch></SupplierInfoSearch>
            <SupplierInfoMain></SupplierInfoMain>
        </SupplierInfoProvider>
    );
};
