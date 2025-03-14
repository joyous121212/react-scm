import { ContentBox } from "../../components/common/ContentBox/ContentBox";
import { OrdersReturnListMain } from "../../components/page/delivery/ordersReturnList/OrdersReturnListMain/OrdersReturnListMain";
import { OrderReturnListSearch } from "../../components/page/delivery/ordersReturnList/OrdersReturnListSearch/OrdersReturnListSearch";

export const OrdersReturnListDe = () => {
    return (
        <>
            <ContentBox variant='primary' fontSize='large'>
                발주 반품 목록
            </ContentBox>
            <OrderReturnListSearch></OrderReturnListSearch>
            <OrdersReturnListMain></OrdersReturnListMain>
        </>
    );
};
