import { InquiryInfo } from "../../../../../api/api";
import { searcinquiryListApi } from "../../../../../api/InquiryApi/searcinquiryListApi";
import { InquiryContext } from "../../../../../api/Provider/Inquiry/InquiryProvider";
import { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { CommonCodeMainStyled } from "../../CommonCode/CommonCodeMain/styled";
import { Column } from "../../../../common/StyledTable/StyledTable";
import { StyledTable } from "../../../../common/StyledTable/StyledTable";
import { IInquiryList } from "../../../../../models/interface/IInquiry";
import { ISearcInquiryListApiResponse } from "../../../../../models/interface/IInquiry";
import { useRecoilState } from "recoil";
import { modalState, detailModalState } from "../../../../../stores/modalState";
import { Portal } from "../../../../common/potal/Portal";
import { InquiryCUserTypeModal } from "../InquiryCUserTypeModal/InquiryCUserTypeModal";
import { PageNavigate } from "../../../../common/pageNavigation/PageNavigate";
import { InquirySUserTypeModal } from "../InquirySUserTypeModal/InquirySUserTypeModal";
export const InquiryMain = () => {
    const { search } = useLocation();
    const userInfo = sessionStorage.getItem("userInfo");
    const { userType } = JSON.parse(userInfo);
    const [modal, setMoal] = useRecoilState(modalState);
    const [detailModal, setDetailMoal] = useRecoilState(detailModalState);

    const columns = [
        { key: "inquiryId", title: "문의번호" },
        { key: "category", title: "카테고리" },
        { key: "title", title: "문의제목" },
        { key: "createdDate", title: "문의날짜" },
        { key: "ansState", title: "답변상태" },
        { key: "author", title: "작성자 아이디" },
    ] as Column<any>[];

    const { searchKeyword, setSearchKeyword } = useContext(InquiryContext);
    const [inquiry, setInquiry] = useState<IInquiryList[]>();
    const [inquiryCnt, setInquiryCnt] = useState<number>();
    const [cPage, setCPage] = useState<number>(0);
    const [inquiryId, setInquiryId] = useState<number | undefined>();
    async function searchFnc(currentPage?: number) {
        const userType = JSON.parse(sessionStorage.getItem("userInfo")).userType;

        currentPage = currentPage || 1;
        const searchParam = new URLSearchParams(search);
        searchParam.append("currentPage", currentPage.toString());
        searchParam.append("pageSize", "5");
        searchParam.append("searchTitle", searchKeyword.searchTitle.toString());
        searchParam.append("searchStDate", searchKeyword.searchStDate.toString());
        searchParam.append("searchEdDate", searchKeyword.searchEdDate.toString());
        searchParam.append("userType", userType);
        const res: ISearcInquiryListApiResponse = await searcinquiryListApi(InquiryInfo.inquiryListBody, searchParam);
        if (res) {
            setInquiry(res.inquiry);
            setInquiryCnt(res.inquiryCnt);
            setCPage(currentPage);
        }
    }

    useEffect(() => {
        // alert("post레더 에서 두번이상 계속 떠야함");
        searchFnc();
    }, [searchKeyword]);

    const suppDetailInfoSearchApi = async (currentPage?: number) => {
        currentPage = currentPage || 1;
        const box = { ...searchKeyword };
        box.currentPage = currentPage;
        setSearchKeyword(box);
    };

    useEffect(() => {
        console.log("cPage: " + cPage);
    }, [cPage]);

    return (
        <>
            <CommonCodeMainStyled>
                <StyledTable
                    data={inquiry}
                    columns={columns}
                    onRowClick={(row) => {
                        console.log(row.inquiryId);
                        setInquiryId(parseInt(row.inquiryId));
                        setDetailMoal(!detailModal);
                        setMoal(false);
                    }}
                />
                <PageNavigate
                    totalItemsCount={inquiryCnt}
                    onChange={searchFnc}
                    itemsCountPerPage={5}
                    activePage={cPage}
                />
            </CommonCodeMainStyled>
            {modal && userType === "C" && (
                <Portal>
                    <InquiryCUserTypeModal inquiryId={undefined} />
                </Portal>
            )}
            {detailModal && userType === "C" && (
                <Portal>
                    <InquiryCUserTypeModal inquiryId={inquiryId} />
                </Portal>
            )}
             {detailModal && userType === "S" && (
                <Portal>
                    <InquirySUserTypeModal inquiryId={inquiryId} />
                </Portal>
            )}
        </>
    );
};
