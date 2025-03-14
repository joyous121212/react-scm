import { OrdersReturnListProvider } from "../../api/Provider/OrdersReturnListProvider";
import { ContentBox } from "../../components/common/ContentBox/ContentBox";
import { OrdersReturnListMain } from "../../components/page/tasks/OrdersReturnList/OrdersReturnListMain/OrdersReturnListMain";
import { OrdersReturnListSearch } from "../../components/page/tasks/OrdersReturnList/OrdersReturnListSearch/OrdersReturnListSearch";

export const OrdersReturnList = () => {
    return (
        <OrdersReturnListProvider>
            <ContentBox variant='primary' fontSize='large'>
                발주 반품 지시서 목록
            </ContentBox>

            <OrdersReturnListSearch />
            <OrdersReturnListMain />
        </OrdersReturnListProvider>
    );
};
