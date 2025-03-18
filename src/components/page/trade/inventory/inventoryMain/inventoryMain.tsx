import { useContext, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { inventoryModalState, modalState } from "../../../../../stores/modalState";
import { searchApi } from "../../../../../api/CommonCodeApi/searchApi";
import { Column, StyledTable } from "../../../../common/StyledTable/StyledTable";
import { Inventory } from "../../../../../api/api";
import { PageNavigate } from "../../../../common/pageNavigation/PageNavigate";
import { InventoryMainStyled } from "./styled";
import { InventoryContext } from "../../../../../api/Provider/trade/InventoryProvider";
import { IInventory, IInventoryListResponse, IInventoryPropsOptions } from "../../../../../models/interface/IInventory";
import { InventorySubGrid } from "../inventorySubGrid/inventorySubGrid";
import { Spinner } from "../../../../common/Spinner/spinner";

const initInventoryPropsOptions = {
    inventoryId: 0,
    productId: 0,
    supplyId: 0,
    warehouseId: 0,
};

export const InventoryListMain = () => {
    const { searchTitle } = useContext(InventoryContext);
    const [cPage, setCPage] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [inventoryList, setInventoryList] = useState<IInventory[]>([]);
    const [inventoryListCnt, setInventoryListCnt] = useState<number>(0);
    const [inventoryPropsOption, setInventoryPropsOption] = useState<IInventoryPropsOptions>(initInventoryPropsOptions);
    const [inventoryModal, setInventoryModal] = useRecoilState(inventoryModalState);

    const columns = [
        { key: "categoryName", title: "장비구분" },
        { key: "productNumber", title: "모델번호" },
        { key: "productName", title: "모델명" },
        { key: "supplyName", title: "제조사" },
        { key: "warehouseName", title: "창고" },
        { key: "quantity", title: "재고" },
    ] as Column<IInventory>[];

    useEffect(() => {
        searchInventory();
    }, [searchTitle]);

    const searchInventory = async (currentPage?: number) => {
        if (inventoryModal) {
            setInventoryModal(!inventoryModal);
        }
        currentPage = currentPage || 1;
        setIsLoading(true);
        try {
            const result = await searchApi<IInventoryListResponse>(Inventory.searchList, {
                ...searchTitle,
                currentPage,
                pageSize: 5,
            });

            if (result) {
                setInventoryList(result.inventoryList);
                setInventoryListCnt(result.inventoryCnt);
                setCPage(currentPage);
            }
        } catch (error) {
            console.error("Error fetching shopping orders:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handlerModal = (propsOptions: IInventoryPropsOptions) => {
        const isSameInventory = propsOptions.inventoryId === inventoryPropsOption.inventoryId;

        if (isSameInventory) {
            setInventoryModal(false); // 동일한 아이템을 클릭하면 모달 닫기
        } else {
            setInventoryPropsOption(propsOptions); // 새 아이템 설정
            setInventoryModal(true); // 새로운 아이템을 선택하면 모달 열기
        }
    };

    return (
        <InventoryMainStyled>
            {isLoading ? (
                <Spinner />
            ) : (
                <StyledTable
                    data={inventoryList}
                    columns={columns}
                    onRowClick={(row) =>
                        handlerModal({
                            inventoryId: row.inventoryId,
                            productId: row.productId,
                            supplyId: row.supplyId,
                            warehouseId: row.warehouseId,
                        })
                    }
                />
            )}
            <PageNavigate
                totalItemsCount={inventoryListCnt}
                onChange={searchInventory}
                itemsCountPerPage={5}
                activePage={cPage}
            />
            {inventoryModal && <InventorySubGrid inventoryPropsOption={inventoryPropsOption} />}
        </InventoryMainStyled>
    );
};
