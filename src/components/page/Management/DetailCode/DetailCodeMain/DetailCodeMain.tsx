import { useLocation, useNavigate, useParams } from "react-router-dom";
import { StyledButton } from "../../../../common/StyledButton/StyledButton";
import { DetailCodeMainStyled } from "./styled";
import { useContext, useEffect, useState } from "react";
import { CommonDetailCodeContext } from "../../../../../api/Provider/CommonDetailCodeProvider";
import { Column, StyledTable } from "../../../../common/StyledTable/StyledTable";
import { ICommonDetailCode, ICommonDetailResponse } from "../../../../../models/interface/ICommonCode";
import { useRecoilState } from "recoil";
import { modalState } from "../../../../../stores/modalState";
import { searchApi } from "../../../../../api/CommonCodeApi/searchApi";
import { DetailCode } from "../../../../../api/api";
import { Spinner } from "../../../../common/Spinner/spinner";
import { PageNavigate } from "../../../../common/pageNavigation/PageNavigate";
import { Portal } from "../../../../common/potal/Portal";
import { DetailCodeModal } from "../DetailModal/DetailModal";

export const DetailCodeMain = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    const [commonDetailCodeCount, setCommonDetailCodeCount] = useState<number>(0);
    const [cPage, setCPage] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [detailCodeId, setDetailCodeId] = useState<number>(0);
    const [modal, setModal] = useRecoilState(modalState);
    const [commonDetailCodeList, setDetailCodeList] = useState<ICommonDetailCode[]>();
    const { searchKeyword, setGroupCode } = useContext(CommonDetailCodeContext);

    const columns = [
        { key: "detailIdx", title: "번호" },
        { key: "groupCode", title: "그룹코드" },
        { key: "detailCode", title: "상세코드" },
        { key: "detailName", title: "상세코드명" },
        { key: "note", title: "상세 코드 설명" },
        { key: "useYn", title: "사용여부" },
        { key: "actions", title: "비고" },
    ] as Column<ICommonDetailCode>[];

    useEffect(() => {
        searchDetailCode();
    }, [searchKeyword]);

    const searchDetailCode = async (currentPage?: number) => {
        currentPage = currentPage || 1;
        setIsLoading(true);
        try {
            const result = await searchApi<ICommonDetailResponse>(DetailCode.searchList, {
                ...searchKeyword,
                groupCode: state.groupCode,
                currentPage,
                pageSize: 5,
            });

            if (result) {
                setCommonDetailCodeCount(result.commonDetailCodeCnt);
                setDetailCodeList(result.commonDetailCode);
                setCPage(currentPage);
                setGroupCode(result.commonDetailCode[0].groupCode);
            }
        } catch (error) {
            console.error("Error fetching shopping orders:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handlerModal = (id: number) => {
        setModal(!modal);
        setDetailCodeId(id);
    };

    const postSuccess = () => {
        setModal(!modal);
        searchDetailCode();
    };
    return (
        <DetailCodeMainStyled>
            {isLoading ? (
                <Spinner />
            ) : (
                <StyledTable
                    data={commonDetailCodeList}
                    columns={columns}
                    renderAction={(row) => (
                        <StyledButton size='small' onClick={(e) => handlerModal(row.detailIdx)}>
                            수정
                        </StyledButton>
                    )}
                />
            )}
            <PageNavigate
                totalItemsCount={commonDetailCodeCount}
                onChange={searchDetailCode}
                itemsCountPerPage={5}
                activePage={cPage}
            />
            <div className='button-container'>
                <StyledButton onClick={() => navigate(-1)}>뒤로가기</StyledButton>
            </div>
            {modal && (
                <Portal>
                    <DetailCodeModal
                        detailCodeId={detailCodeId}
                        postSuccess={postSuccess}
                        setDetailCodeId={setDetailCodeId}
                    />
                </Portal>
            )}
        </DetailCodeMainStyled>
    );
};
