import { InventoryListMain } from "../../../components/page/trade/inventory/inventoryMain/inventoryMain";
import { ShoppingOrdersMain } from "../../../components/page/trade/shoppingOrders/shoppingOrdersMain/shoppingOrdersMain";
import { ShoppingReturnListMain } from "../../../components/page/trade/shoppingReturnList/shoppingReturnListMain/shoppingReturnListMain";

export const SCMMain = () => {
    return (
        <>
            <div className='label-container'>
                <label>일별 수주 내역</label>
            </div>
            <ShoppingOrdersMain />
            <div className='label-container'>
                <label>창고별 재고 현황</label>
            </div>
            <InventoryListMain />
            <div className='label-container'>
                <label>반품 신청 현황</label>
            </div>
            <ShoppingReturnListMain />
        </>
    );
};
