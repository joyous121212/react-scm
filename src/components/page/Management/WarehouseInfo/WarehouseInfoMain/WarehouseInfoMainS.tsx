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
import { useLocation } from "react-router-dom";
import { PageNavigate } from "../../../../common/pageNavigation/PageNavigate";
export const WarehouseInfoMain = () => {
    const [detailModal, setDetailModal] = useRecoilState(detailModalState);
    const { search } = useLocation();
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
    const [warehouseInfoCnt, setWarehouseInfoCnt] = useState<number>();
    const [cPage, setCPage] = useState<number>(0);

    const warehouseIdRef = useRef<number>(-1);
    const searychFNC = async (currentPage?: number) => {
        currentPage = currentPage || 1;
        const searchParam = new URLSearchParams(search);
        searchParam.append("currentPage", currentPage.toString());
        searchParam.append("pageSize", "5");
        searchParam.append("searchTarget", searchKeyword.searchTarget.toString());
        searchParam.append("searchKeyword", searchKeyword.searchKeyword.toString());

        const res: ISearchWarehouseInfoList = await searchWarehouseInfoListApi(
            WarehouseInfo.warehouseInfoList,
            searchParam
        );

        if (res) {
            setWarehouseInfoList(res.warehouseInfoList);
            setWarehouseInfoCnt(res.warehouseInfoCnt);
            setCPage(currentPage);
        }
    };

    useEffect(() => {
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
            <PageNavigate
                totalItemsCount={warehouseInfoCnt}
                onChange={searychFNC}
                itemsCountPerPage={5}
                activePage={cPage}
            />

            {detailModal && (
                <Portal>
                    <WarehouseInfoModal warehouseId={warehouseIdRef.current}></WarehouseInfoModal>
                </Portal>
            )}
        </>
    );
};
