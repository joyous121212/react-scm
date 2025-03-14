import { ContentBox } from "../../components/common/ContentBox/ContentBox";
import { ProductInfoSearch } from "../../components/page/Management/ProductInfo/ProductInfoSearch/ProductInfoSearch";
import { ProductInfoProvider } from "../../api/Provider/ProductInfo/ProductInfoProvider";
import { ProductInfoMain } from "../../components/page/Management/ProductInfo/ProductInfoMain/ProductInfoMain";
export const ProductInfo = () => {
    return (
        <>
            <ProductInfoProvider>
                <ContentBox variant='primary' fontSize='large'>
                    제품 정보 관리
                </ContentBox>
                <ProductInfoSearch />
                <ProductInfoMain />
            </ProductInfoProvider>
        </>
    );
};
