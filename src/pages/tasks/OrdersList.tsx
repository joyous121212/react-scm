import { OrderListProvider } from "../../api/Provider/OrderListProvider";
import { ContentBox } from "../../components/common/ContentBox/ContentBox";
import { OrdersListMain } from "../../components/page/tasks/OrdersList/OrdersListMain/OrdersListMain";
import { OrdersListSearch } from "../../components/page/tasks/OrdersList/OrdersListSearch/OrdersListSearch";

export const OrdersList = () => {
    return (
        <OrderListProvider>
            <ContentBox variant='primary' fontSize='large'>
                발주 지시서
            </ContentBox>

            <OrdersListSearch />
            <OrdersListMain />
        </OrderListProvider>
    );
};
