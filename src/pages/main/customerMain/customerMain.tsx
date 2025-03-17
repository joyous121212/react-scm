import { InventoryListMain } from "../../../components/page/trade/inventory/inventoryMain/inventoryMain";
import { ShoppingOrdersMain } from "../../../components/page/trade/shoppingOrders/shoppingOrdersMain/shoppingOrdersMain";
import { ShoppingReturnListMain } from "../../../components/page/trade/shoppingReturnList/shoppingReturnListMain/shoppingReturnListMain";
import { ProductSlideshow } from "../../../components/page/main/customerMain/productSlide/slideshow";

export const CustomerMain = () => {
    return (
        <>
            <div className='label-container'>
                <label>상품 view</label>
            </div>
            <ProductSlideshow />
        </>
    );
};
