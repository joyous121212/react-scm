import { FC, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { inventoryModalState, modalState, selectRowState } from "../../../../../stores/modalState";
import { searchApi } from "../../../../../api/CommonCodeApi/searchApi";
import { Column, StyledTable } from "../../../../common/StyledTable/StyledTable";
import { Inventory } from "../../../../../api/api";
import { InventorySubGridStyled } from "./styled";
import {
    IInventory,
    IInventoryDetailResponse,
    IInventoryPropsOptions,
} from "../../../../../models/interface/IInventory";
import { StyledButton } from "../../../../common/StyledButton/StyledButton";
import { Spinner } from "../../../../common/Spinner/spinner";

interface IInventorySubGridProps {
    inventoryPropsOption: IInventoryPropsOptions;
}

export const InventorySubGrid: FC<IInventorySubGridProps> = ({ inventoryPropsOption }) => {
    const [inventoryDetail, setInventoryDetail] = useState<IInventory[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [selectRow, setSelectRow] = useRecoilState(selectRowState);
    const [inventoryModal, setInventoryModal] = useRecoilState(inventoryModalState);

    const columns = [
        { key: "productName", title: "제품명" },
        { key: "warehouseName", title: "창고명" },
        { key: "warehouseCode", title: "창고코드" },
        { key: "warehouseAddress", title: "창고위치" },
        { key: "warehouseManager", title: "담당자" },
        { key: "input", title: "입고량" },
        { key: "output", title: "출고량" },
        { key: "quantity", title: "결과수량" },
    ] as Column<IInventory>[];

    useEffect(() => {
        searchInventoryDetail();
    }, [inventoryPropsOption]);

    const searchInventoryDetail = async () => {
        setIsLoading(true);
        try {
            const result = await searchApi<IInventoryDetailResponse>(Inventory.searchDetail, inventoryPropsOption);

            if (result) {
                setInventoryDetail(result.detailValue);
            }
        } catch (error) {
            console.error("Error fetching shopping orders:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const modalClose = () => {
        setInventoryModal(!inventoryModal);
        setSelectRow(!selectRow);
    };

    return (
        <InventorySubGridStyled>
            {isLoading ? (
                <Spinner />
            ) : (
                <StyledTable
                    data={inventoryDetail}
                    columns={columns}
                    renderCell={(row, col) => {
                        if (col.key === "input" && row.input > 0) {
                            return <span style={{ color: "blue" }}>{row.input}</span>;
                        }
                        if (col.key === "output" && row.output > 0) {
                            return <span style={{ color: "red" }}>{row.output}</span>;
                        }
                        return row[col.key as keyof IInventory];
                    }}
                    renderHead={(col) => {
                        if (col.key === "input") {
                            return <span style={{ color: "blue" }}>{col.title}</span>;
                        }
                        if (col.key === "output") {
                            return <span style={{ color: "red" }}>{col.title}</span>;
                        }
                        return col.title;
                    }}
                />
            )}
            <div className='closeButton'>
                <StyledButton size='small' onClick={modalClose}>
                    취소
                </StyledButton>
            </div>
        </InventorySubGridStyled>
    );
};
