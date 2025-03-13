import { FC } from "react";
import { IWarehouseList } from "../../../../../models/interface/IShoppingOrders";
import { Column, StyledTable } from "../../../../common/StyledTable/StyledTable";
import { StyledButton } from "../../../../common/StyledButton/StyledButton";

interface IWarehouseListProps {
    warehouseList: IWarehouseList[];
    deleteWarehouseList: (warehouseId: number, closeCount: number) => void;
}

export const WarehouseList: FC<IWarehouseListProps> = ({ warehouseList, deleteWarehouseList }) => {
    const columns = [
        { key: "warehouseName", title: "창고명(재고품목)" },
        { key: "totalProductStock", title: "총 재고 개수" },
        { key: "orderCount", title: "주문 개수" },
        { key: "actions", title: "비고" },
    ] as Column<IWarehouseList>[];

    return (
        <>
            <StyledTable
                data={warehouseList}
                columns={columns}
                renderAction={(row) => (
                    <StyledButton
                        size='small'
                        variant='danger'
                        onClick={() => deleteWarehouseList(row.warehouseId, row.orderCount)}
                    >
                        삭제
                    </StyledButton>
                )}
            />
        </>
    );
};
