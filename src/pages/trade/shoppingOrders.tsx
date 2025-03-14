
import { ShoppingOrdersProvider } from "../../api/Provider/trade/ShoppingOrdersProvider";
import { ContentBox } from "../../components/common/ContentBox/ContentBox";
import { ShoppingOrdersMain } from "../../components/page/trade/shoppingOrders/shoppingOrdersMain/shoppingOrdersMain";
import { ShoppingOrdersSearch } from "../../components/page/trade/shoppingOrders/shoppingOrdersSearch/shoppingOrdersSearch";

export const ShoppingOrders = () => {
    return (
        <>
            <ShoppingOrdersProvider>
                <ContentBox variant='primary' fontSize='large'>
                    거래 내역
                </ContentBox>
                <ShoppingOrdersSearch/>
                <ShoppingOrdersMain/>
            </ShoppingOrdersProvider>
        </>
    );
};
