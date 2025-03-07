
import { InventoryProvider } from "../../api/Provider/trade/InventoryProvider";
import { ContentBox } from "../../components/common/ContentBox/ContentBox";
import { InventorySearch } from "../../components/page/trade/inventory/inventorySearch/inventorySearch";

export const Inventory = () => {
    return (
        <>
            <InventoryProvider>
                <ContentBox variant='primary' fontSize='large'>
                    재고현황 및 입출고내역
                </ContentBox>
                <InventorySearch/>
            </InventoryProvider>
        </>
    );
};
