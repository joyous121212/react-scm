import { DeliveryProvider } from "../../api/Provider/DeliveryProvider";
import { ContentBox } from "../../components/common/ContentBox/ContentBox";
import { ShoppingListMain } from "../../components/page/delivery/shoppingList/ShoppingListMain/ShoppingListMain";
import { ShoppingListSearch } from "../../components/page/delivery/shoppingList/ShoppingListSearch/ShoppingListSearch";

export const ShoppingList = () => {
    return (
        <DeliveryProvider>
            <ContentBox variant='primary' fontSize='large'>
                주문 배송 목록
            </ContentBox>
            <ShoppingListSearch></ShoppingListSearch>
            <ShoppingListMain></ShoppingListMain>
        </DeliveryProvider>
    );
};
