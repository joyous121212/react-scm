import { useLocation } from "react-router-dom";
import { StyledTable, StyledTd, StyledTh } from "../../../../common/styled/StyledTable";
import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { PageNavigate } from "../../../../common/pageNavigation/PageNavigate";
import { NoticeModal } from "../NoticeModal/NoticeModal";
import { Portal } from "../../../../common/potal/Portal";
import { useRecoilState } from "recoil";
import { modalState } from "../../../../../stores/modalState";
import { searchApi } from "../../../../../api/NoticeApi/searchApi";
import { Notice } from "../../../../../api/api";
import { INotice, INoticeListBodyResponse } from "../../../../../models/interface/INotice";

export const NoticeMain = () => {
    const { search } = useLocation();
    const [noticeList, setNoticeList] = useState<INotice[]>([]);
    const [noticeCount, setNoticeCount] = useState<number>(0);
    const [cPage, setCPage] = useState<number>(0);
    const [modal, setModal] = useRecoilState<boolean>(modalState);
    const [noticeId, setNoticeId] = useState<number>(0);

    useEffect(() => {
        searchNoticeList();
    }, [search]);

    const searchNoticeList = async (currentPage?: number) => {
        currentPage = currentPage || 1;
        const searchParam = new URLSearchParams(search);
        searchParam.append("currentPage", currentPage.toString());
        searchParam.append("pageSize", "5");

        const result = await searchApi<INoticeListBodyResponse, URLSearchParams>(Notice.search, searchParam);

        console.log(result);

        if (result) {
            setNoticeList(result.noticeList);
            setNoticeCount(result.noticeCnt);
            setCPage(currentPage);
        }
    };

    const handlerModal = (id: number) => {
        setModal(!modal);
        setNoticeId(id);
    };

    const postSuccess = () => {
        setModal(!modal);
        searchNoticeList(cPage);
    };

    return (
        <>
            총 갯수 {noticeCount} : 현재 페이지 : {cPage}
            <StyledTable>
                <thead>
                    <tr>
                        <StyledTh size={5}>번호</StyledTh>
                        <StyledTh size={50}>제목</StyledTh>
                        <StyledTh size={10}>작성자</StyledTh>
                        <StyledTh size={20}>등록일</StyledTh>
                    </tr>
                </thead>
                <tbody>
                    {noticeList?.length > 0 ? (
                        noticeList.map((notice) => {
                            return (
                                <tr key={notice.noticeId}>
                                    <StyledTd>{notice.noticeId}</StyledTd>
                                    <StyledTd onClick={() => handlerModal(notice.noticeId)}>{notice.title}</StyledTd>
                                    <StyledTd>{notice.author}</StyledTd>
                                    <StyledTd>{notice.createdDate}</StyledTd>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <StyledTd colSpan={4}>데이터가 없습니다.</StyledTd>
                        </tr>
                    )}
                </tbody>
            </StyledTable>
            <PageNavigate
                totalItemsCount={noticeCount}
                onChange={searchNoticeList}
                itemsCountPerPage={5}
                activePage={cPage}
            />
            {modal && (
                <Portal>
                    <NoticeModal noticeId={noticeId} setNoticeId={setNoticeId} postSuccess={postSuccess} />
                </Portal>
            )}
        </>
    );
};
