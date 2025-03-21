import { useContext, useEffect, useRef, useState } from "react";
import { StyledButton } from "../../../../common/StyledButton/StyledButton";
import { StyledSelectBox } from "../../../../common/StyledSelectBox/StyledSelectBox";
import { InventorySearchStyled } from "./styled";
import { InventoryContext } from "../../../../../api/Provider/trade/InventoryProvider";
import { searchApi } from "../../../../../api/tradeApi/searchApi";
import { IInventorySelectBoxResponse } from "../../../../../models/interface/IInventory";
import { Inventory } from "../../../../../api/api";
import { ISelectOption, ITempSearchTitle } from "../../../../../models/interface/IShoppingReturnList";
import { StyledInput } from "../../../../common/StyledInput/StyledInput";

export const InventorySearch = () => {
    const options = [{ label: "전체", value: "" }];
    const inputValue = useRef<HTMLInputElement>();
    const [selectProduct, setSelectProduct] = useState<number>(0);
    const [selectSupply, setSelectSupply] = useState<number>(0);
    const [selectWarehouse, setSelectWarehouse] = useState<number>(0);
    const [productOptions, setProductOptions] = useState<ISelectOption[]>([]);
    const [supplyOptions, setSupplyOptions] = useState<ISelectOption[]>([]);
    const [warehouseOptions, setWarehouseOptions] = useState<ISelectOption[]>([]);
    const { searchTitle, setSearchTitle } = useContext(InventoryContext);
    const [tempSearchTitle, setTempSearchTitle] = useState<ITempSearchTitle>({
        searchProduct: "",
        searchSupply: "",
        searchWarehouse: "",
    });

    useEffect(() => {
        setTempSearchTitle({
            searchProduct: selectProduct ? selectProduct : "",
            searchSupply: selectSupply ? selectSupply : "",
            searchWarehouse: selectWarehouse ? selectWarehouse : "",
        });
    }, [selectProduct, selectSupply, selectWarehouse]);

    useEffect(() => {
        getSelectBox();
    }, [tempSearchTitle]);

    const handlerSearch = () => {
        setSearchTitle({ ...tempSearchTitle, searchKeyword: inputValue.current.value });
    };

    const getSelectBox = async () => {
        try {
            const response = await searchApi<IInventorySelectBoxResponse>(
                Inventory.searchSelectBoxList,
                tempSearchTitle
            );
            if (!response || !response.detailValue) return;

            const data = response.detailValue;

            setWarehouseOptions([
                ...options,
                ...data.warehouseList.map((warehouse) => ({
                    label: warehouse.selectBoxName,
                    value: warehouse.selectBoxId,
                })),
            ]);

            setProductOptions([
                ...options,
                ...data.productList.map((product) => ({
                    label: product.selectBoxName,
                    value: product.selectBoxId,
                })),
            ]);

            setSupplyOptions([
                ...options,
                ...data.supplyList.map((supply) => ({
                    label: supply.selectBoxName,
                    value: supply.selectBoxId,
                })),
            ]);
        } catch (error) {
            console.error("Failed to fetch select box data:", error);
        }
    };

    const handleSelectChange = (newValue: number, tag: string) => {
        switch (tag) {
            case "product":
                setSelectProduct(newValue);
                break;
            case "supply":
                setSelectSupply(newValue);
                break;
            case "warehouse":
                setSelectWarehouse(newValue);
                break;
            default:
                break;
        }
    };

    return (
        <InventorySearchStyled>
            <label>
                제품명 :{" "}
                <StyledSelectBox
                    fixedWidth
                    options={productOptions}
                    value={selectProduct}
                    onChange={(newValue: number) => handleSelectChange(newValue, "product")}
                />
            </label>
            <label>
                제조사명 :{" "}
                <StyledSelectBox
                    fixedWidth
                    options={supplyOptions}
                    value={selectSupply}
                    onChange={(newValue: number) => handleSelectChange(newValue, "supply")}
                />
            </label>
            <label>
                창고명 :{" "}
                <StyledSelectBox
                    fixedWidth
                    options={warehouseOptions}
                    value={selectWarehouse}
                    onChange={(newValue: number) => handleSelectChange(newValue, "warehouse")}
                />
            </label>
            <StyledInput size='search' ref={inputValue} />

            <StyledButton variant='secondary' onClick={handlerSearch}>
                검색
            </StyledButton>
        </InventorySearchStyled>
    );
};
