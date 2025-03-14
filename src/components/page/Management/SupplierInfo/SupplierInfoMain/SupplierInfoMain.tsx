import { useContext, useEffect, useState } from "react";
import { SupplierInfoContext } from "../../../../../api/Provider/SupplierInfoProviderS";

import { CommonCodeMainStyled } from "../../CommonCode/CommonCodeMain/styled";
import { Column } from "../../../../common/StyledTable/StyledTable";
import { StyledTable } from "../../../../common/StyledTable/StyledTable";
import { StyledButton } from "../../../../common/StyledButton/StyledButton";
import { SupplierInfoModal } from "../SupplierInfoModal/SupplierInfoModal";
import { Portal } from "../../../../common/potal/Portal";
import { useRecoilState } from "recoil";
import { detailModalState } from "../../../../../stores/modalState";
import { PageNavigate } from "../../../../common/pageNavigation/PageNavigate";
import { SupplierInfo } from "../../../../../api/api";
import { searchSupplierListApi } from "../../../../../api/SupplierInfoApi/searchSupplierListApi";
import { detailListModalState } from "../../../../../stores/modalState";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
export const SupplierInfoMain = () => {
    const [detailListModal, setDetailListModal] = useRecoilState(detailListModalState);
    const { search } = useLocation();
    const { searchKeyword, setSearchKeyword } = useContext(SupplierInfoContext);
    const [supplierList, setSupplierList] = useState([]);
    const [supplierCnt, setSupplierCnt] = useState(0);
    const [supplyId, setSupplyId] = useState(undefined);
    const [detailModal, setDetailModal] = useRecoilState(detailModalState);
    const [cPage, setCPage] = useState<number>(0);
    //
    const [supCount, setSupCoun] = useState<number>(0);

    // 페이지 네이션 돌아가서 주석처리함. 잠시 삭제는 대기
    // const suppDetailInfoSearchApi = async (currentPage?: number) => {
    //     currentPage = currentPage || 1;
    //     const box = { ...searchKeyword };
    //     box.currentPage = currentPage;
    //     setSearchKeyword(box);
    //     // setCPage(currentPage);
    // };
    const navigate = useNavigate();
    const columns = [
        { key: "name", title: "납품업체명" },
        { key: "manager", title: "담당자명" },
        { key: "phone", title: "담당자연락처" },
        { key: "address", title: "주소" },
        { key: "tradeState", title: "거래상태" },
        { key: "actions", title: "비고" },
    ] as Column<any>[];
    async function searChCall(currentPage?: number) {
        currentPage = currentPage || 1;
        const searchParam = new URLSearchParams(search);
        searchParam.append("currentPage", currentPage.toString());
        searchParam.append("pageSize", "5");
        searchParam.append("searchOption", searchKeyword.searchOption.toString());
        searchParam.append("searchKeyword", searchKeyword.searchKeyword.toString());

        const res: any = await searchSupplierListApi(SupplierInfo.searchSupplierList, searchParam);
        console.log(res);
        if (res) {
            setSupplierList(res.supplier);
            setSupplierCnt(res.supplierCnt);
            setCPage(currentPage);
        }
    }
    useEffect(() => {
        searChCall();
    }, [searchKeyword]);

    useEffect(() => {
        console.log(supplierList);
    });

    const goNewPage = (supplyId: string) => {
        setDetailListModal(!detailListModal);
    };

    return (
        <>
            {supplierList != null ? (
                <>
                    <CommonCodeMainStyled>
                        <StyledTable
                            data={supplierList}
                            columns={columns}
                            //백단으로 오직 한개의 supplyId 을 넘겨야 한다.  supplyDetail(${list.supplyId});
                            renderAction={(row) => (
                                <StyledButton
                                    size='small'
                                    onClick={async () => {
                                        setSupplyId(row.supplyId);
                                        setDetailModal(!detailModal);
                                    }}
                                >
                                    수정
                                </StyledButton>
                            )}
                            onCellClick={(row, column) => {
                                if (column != "actions") {
                                    goNewPage(row.supplyId);
                                    navigate(`${row.supplyId}`, { state: { groupCode: row.groupCode } });
                                }
                            }}
                        />
                    </CommonCodeMainStyled>
                    <>
                        <PageNavigate
                            totalItemsCount={supplierCnt}
                            onChange={searChCall}
                            itemsCountPerPage={5}
                            activePage={cPage}
                        />
                    </>
                </>
            ) : (
                <></>
            )}

            {detailModal && (
                <Portal>
                    <SupplierInfoModal supplyId={supplyId} detailModal={detailModal} />
                </Portal>
            )}
        </>
    );
};
