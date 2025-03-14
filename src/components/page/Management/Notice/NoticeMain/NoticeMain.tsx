import { useLocation } from "react-router-dom";
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
import { ILoginInfo } from "../../../../../models/interface/store/userInfo";
import { loginInfoState } from "../../../../../stores/userInfo";
import { Column, StyledTable } from "../../../../common/StyledTable/StyledTable";
import { NoticeMainStyled } from "./styled";
import { Spinner } from "../../../../common/Spinner/spinner";

export const NoticeMain = () => {
    const { search } = useLocation();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [noticeList, setNoticeList] = useState<INotice[]>([]);
    const [noticeCount, setNoticeCount] = useState<number>(0);
    const [cPage, setCPage] = useState<number>(0);
    const [modal, setModal] = useRecoilState<boolean>(modalState);
    const [noticeId, setNoticeId] = useState<number>(0);
    const [userInfo] = useRecoilState<ILoginInfo>(loginInfoState);

    const columns = [
        { key: "noticeId", title: "번호" },
        { key: "title", title: "제목" },
        { key: "author", title: "작성자" },
        { key: "createdDate", title: "등록일" },
    ] as Column<INotice>[];

    useEffect(() => {
        const sessionUserInfo = sessionStorage.getItem("userInfo");
        console.log(userInfo, "recoil");
        searchNoticeList();
    }, [search]);

    const searchNoticeList = async (currentPage?: number) => {
        setIsLoading(true);
        currentPage = currentPage || 1;
        const searchParam = new URLSearchParams(search);
        searchParam.append("currentPage", currentPage.toString());
        searchParam.append("pageSize", "5");

        try {
            const result = await searchApi<INoticeListBodyResponse, URLSearchParams>(Notice.search, searchParam);
            if (result) {
                setNoticeList(result.noticeList);
                setNoticeCount(result.noticeCnt);
                setCPage(currentPage);
            }
        } catch (error) {
            console.error("Error fetching shopping orders:", error);
        } finally {
            setIsLoading(false);
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
        <NoticeMainStyled>
            {isLoading ? (
                <Spinner />
            ) : (
                <StyledTable
                    data={noticeList}
                    columns={columns}
                    onRowClick={(row) => handlerModal(row.noticeId)}
                    renderCell={(row, column) => {
                        if (column.key === "createdDate") {
                            return row.createdDate.split(" ")[0];
                        }
                        return row[column.key as keyof INotice];
                    }}
                />
            )}
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
        </NoticeMainStyled>
    );
};
