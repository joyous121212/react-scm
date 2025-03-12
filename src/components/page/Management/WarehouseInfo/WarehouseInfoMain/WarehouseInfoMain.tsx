import { useContext, useEffect, useState } from "react";
import { WarehouseInfoContext } from "../../../../../api/Provider/WarehouseInfo/WarehouseInfoProvider";
import { searchWarehouseInfoListApi } from "../../../../../api/WarehouseInfoApi/searchWarehouseInfoListApi";
import { WarehouseInfo } from "../../../../../api/api";
import { ISearchWarehouseInfoList } from "../../../../../models/interface/IWarehouse";
import { IWarehouseInfoCount } from "../../../../../models/interface/IWarehouse";
import { IWarehouseInfo } from "../../../../../models/interface/IWarehouse";
import { CommonCodeMainStyled } from "../../CommonCode/CommonCodeMain/styled";
import { Column } from "../../../../common/StyledTable/StyledTable";
import { StyledTable } from "../../../../common/StyledTable/StyledTable";
import { useRecoilState } from "recoil";
import { detailModalState } from "../../../../../stores/modalState";
import { Portal } from "../../../../common/potal/Portal";
import { WarehouseInfoModal } from "../WarehouseInfoModal/WarehouseInfoModal";
import { useRef } from "react";
export const WarehouseInfoMain = () => {
    const [detailModal, setDetailModal] = useRecoilState(detailModalState);

    const columns = [
        { key: "warehouseCode", title: "창고코드" },
        { key: "name", title: "창고명" },
        { key: "manager", title: "담당자" },
        { key: "email", title: "이메일" },
        { key: "phone", title: "전화번호" },
        { key: "zipCode", title: "우편번호" },
        { key: "address", title: "창고위치" },
    ] as Column<any>[];

    const { searchKeyword, setSearchKeyword } = useContext(WarehouseInfoContext);

    const [warehouseInfoList, setWarehouseInfoList] = useState<IWarehouseInfo[]>();
    const [warehouseInfoCnt, setWarehouseInfoCnt] = useState<IWarehouseInfoCount>();
    const warehouseIdRef = useRef<number>(-1);

    useEffect(() => {
        const searychFNC = async () => {
            const res: ISearchWarehouseInfoList = await searchWarehouseInfoListApi(
                WarehouseInfo.warehouseInfoList,
                searchKeyword
            );
            setWarehouseInfoList(res.warehouseInfoList);
            setWarehouseInfoCnt(res.warehouseInfoCnt);
        };

        searychFNC();
    }, [searchKeyword]);

    return (
        <>
            <CommonCodeMainStyled>
                <StyledTable
                    data={warehouseInfoList}
                    columns={columns}
                    onRowClick={(row) => {
                        // console.log(row.warehouseId);
                        // productIdRef.current = row.productId;
                        // setUpdateModal(!updateModal);
                        warehouseIdRef.current = row.warehouseId;
                        setDetailModal(!detailModal);
                    }}
                />
            </CommonCodeMainStyled>

            {detailModal && (
                <Portal>
                    <WarehouseInfoModal warehouseId={warehouseIdRef.current}></WarehouseInfoModal>
                </Portal>
            )}
        </>
    );
};
