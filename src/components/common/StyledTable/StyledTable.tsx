import { useState } from "react";
import { Table, Td, Th, Thead, Tr } from "./styled";
import noData from "../../../assets/noData.png";
import { useRecoilState } from "recoil";
import { selectRowState } from "../../../stores/modalState";

export interface Column<T> {
    key: keyof T | "actions";
    title: string;
    clickable?: boolean;
    width: string;
}

interface TableProps<T> {
    columns?: Column<T>[];
    data: T[];
    striped?: boolean;
    bordered?: boolean;
    hoverable?: boolean;
    fullWidth?: boolean;
    onRowClick?: (row: T) => void;
    onCellClick?: (row: T, column: keyof T) => void;
    renderAction?: (row: T) => React.ReactNode;
    renderCell?: (row: T, column: Column<T>) => React.ReactNode;
    renderHead?: (column: Column<T>) => React.ReactNode;
}

export const StyledTable = <T extends { [key: string]: any }>({
    columns,
    data,
    onCellClick,
    onRowClick,
    renderAction,
    striped,
    renderCell,
    bordered,
    hoverable,
    fullWidth,
    renderHead,
    getRowClass,
}: TableProps<T> & { getRowClass?: (row: T) => string }) => {
    const [selectedRow, setSelectedRow] = useState<number | null>(null);
    const [selectRow, setSelectRow] = useRecoilState(selectRowState);

    const generatedColumns =
        columns ??
        (data.length > 0
            ? Object.keys(data[0]).map((key) => ({ key: key as keyof T, title: key, clickable: false }))
            : []);

    const handleRowClick = (row: T, index: number) => {
        setSelectRow(!selectRow);
        setSelectedRow((prevIndex) => (prevIndex === index ? null : index));
        onRowClick?.(row);
    };

    return (
        <Table fullWidth={fullWidth} bordered={bordered}>
            <Thead>
                <tr>
                    {generatedColumns.map((col) => (
                        <Th key={col.key as string} bordered={bordered} style={{ width: col.width }}>
                            {renderHead ? renderHead(col) : col.title}
                        </Th>
                    ))}
                </tr>
            </Thead>
            <tbody>
                {data?.length > 0 ? (
                    data?.map((row, index) => (
                        <Tr
                            key={index}
                            striped={striped}
                            hoverable={hoverable}
                            onClick={() => handleRowClick(row, index)}
                            className={
                                getRowClass ? getRowClass(row) : selectedRow === index && selectRow ? "selected" : ""
                            }
                        >
                            {columns.map((col) => (
                                <Td
                                    key={col.key as string}
                                    bordered={bordered}
                                    clickable={col.clickable}
                                    onClick={() => onCellClick?.(row, col.key)}
                                >
                                    {col.key === "actions" && renderAction
                                        ? renderAction(row)
                                        : renderCell
                                          ? renderCell(row, col)
                                          : (row[col.key as keyof T] as React.ReactNode)}
                                </Td>
                            ))}
                        </Tr>
                    ))
                ) : (
                    <Tr>
                        <Td colSpan={columns.length}>
                            <img src={noData} alt='noData' />
                        </Td>
                    </Tr>
                )}
            </tbody>
        </Table>
    );
};
