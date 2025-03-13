import { ContentBox } from "../../components/common/ContentBox/ContentBox";
import { OrdersListMain } from "../../components/page/delivery/ordersList/ordersListMain/OrdersListMain";
import { OrderListSearch } from "../../components/page/delivery/ordersList/ordersListSearch/OrderListSearch";

export const OrdersList = () => {
    return (
        <>
            <ContentBox variant='primary' fontSize='large'>
                발주 지시서 목록
            </ContentBox>
            <OrderListSearch />
            <OrdersListMain></OrdersListMain>
        </>
    );
};
