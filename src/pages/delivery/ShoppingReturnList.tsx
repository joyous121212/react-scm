import { DeliveryProvider } from "../../api/Provider/DeliveryProvider";
import { ContentBox } from "../../components/common/ContentBox/ContentBox";
import { ShoppingReturnListMainDe } from "../../components/page/delivery/shoppingReturnList/shoppingReturnListMain/shoppingReturnListMain";
import { ShoppingReturnListSearchDe } from "../../components/page/delivery/shoppingReturnList/shoppingReturnListSearch/shoppingReturnListSearch";

export const ShoppingReturnListDe = () => {
    return (
        <DeliveryProvider>
            <ContentBox variant='primary' fontSize='large'>
                주문 반품 목록
            </ContentBox>
            <ShoppingReturnListSearchDe></ShoppingReturnListSearchDe>
            <ShoppingReturnListMainDe></ShoppingReturnListMainDe>
        </DeliveryProvider>
    );
};
