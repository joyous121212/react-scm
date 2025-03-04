import { useContext, useEffect, useState } from "react";
import { CommonCodeMainStyled } from "./styled";
import { CommonCodeContext } from "../../../../../api/Provider/CommonCodeProvider";
import { StyledButton } from "../../../../common/StyledButton/StyledButton";
import { useRecoilState } from "recoil";
import { modalState } from "../../../../../stores/modalState";
import { CommonCodeModal } from "../CommonCodeModal/CommonCodeModal";
import { Portal } from "../../../../common/potal/Portal";
import { useNavigate } from "react-router-dom";
import { searchApi } from "../../../../../api/CommonCodeApi/searchApi";
import { CommonCode } from "../../../../../api/api";
import { ICommonCode, ICommonCodeResponse } from "../../../../../models/interface/ICommonCode";
import { Column, StyledTable } from "../../../../common/StyledTable/StyledTable";

export const CommonCodeMain = () => {
    const {searchKeyword} = useContext(CommonCodeContext);
    const [commonCodeList, setCommonCodeList] = useState<ICommonCode[]>();
    const [modal, setModal] = useRecoilState(modalState);
    const [groupId, setGroupId] = useState<number>(0);
    const navigate = useNavigate();

    const columns = [
        {key: "groupIdx", title: "번호"},
        {key: "groupCode", title: "그룹코드", clickable: true},
        {key: "groupName", title: "그룹코드명"},
        {key: "note", title: "그룹코드설명"},
        {key: "createdDate", title: "등록일"},
        {key: "useYn", title: "사용여부"},
        {key: "actions", title: "비고"},

    ] as Column<ICommonCode>[];

    useEffect(() => {
        searchCommonCode();
    }, [searchKeyword]);

    const searchCommonCode = async (currentPage?: number) => {
        currentPage = currentPage || 1;

        const result = await searchApi<ICommonCodeResponse>(CommonCode.searchList, {
            ...searchKeyword,
            currentPage, 
            pageSize: 5,
        });

        if(result) {
            setCommonCodeList(result.commonCode); 
        }

        // axios.post("/management/commonCodeListBody.do", {
        //     ...searchKeyword,
        //     currentPage, 
        //     pageSize: 5,
            
        // }).then((res: AxiosResponse<ICommonCodeResponse>) => {
        //     setCommonCodeList(res.data.commonCode);
        // });
    }

    const handlerModal = (id: number) => {
        setModal(!modal);
        setGroupId(id);
    }

    
    const postSuccess = () => {
        setModal(!modal);
        searchCommonCode();
    }

    return (
        <CommonCodeMainStyled>
            <StyledTable 
                data={commonCodeList} 
                columns={columns} 
                renderAction={(row) => (
                    <StyledButton size="small" onClick={() => (handlerModal(row.groupIdx))}>수정</StyledButton>
                )}
                onCellClick={(row, column) => {
                    if(column === "groupCode") {
                        navigate(`${row.groupIdx}`, {state: {groupCode: row.groupCode}})
                    }
                }} 
            />
            {
                modal && (
                    <Portal>
                        <CommonCodeModal groupId={groupId} postSuccess={postSuccess} setGroupId={setGroupId}/>
                    </Portal>
                )
            }
            {/* <table>
                <colgroup>
                    <col style={{ width: "5%" }} />
                    <col style={{ width: "20%" }} />
                    <col style={{ width: "10%" }} />
                    <col style={{ width: "10%" }} />
                    <col style={{ width: "10%" }} />
                    <col style={{ width: "8%" }} />
                    <col style={{ width: "5%" }} />
                </colgroup>
                <thead>
                    <tr>
                        <th>번호</th>
                        <th>그룹코드</th>
                        <th>그룹코드명</th>
                        <th>그룹코드설명</th>
                        <th>등록일</th>
                        <th>사용여부</th>
                        <th>비고</th>
                    </tr>
                </thead>
                <tbody>
                    {commonCodeList?.length > 0 ? commonCodeList.map((commonCode) => {
                        return (
                            <tr key={commonCode.groupIdx}>
                                <td>{commonCode.groupIdx}</td>
                                <td 
                                    className='td-pointer' 
                                    onClick={() => {
                                        navigate(`${commonCode.groupIdx}`, {
                                            state: {
                                                groupCode: commonCode.groupCode,
                                            }
                                        })
                                    }}
                                >
                                    {commonCode.groupCode}
                                </td>
                                <td>{commonCode.groupName}</td>
                                <td>{commonCode.note}</td>
                                <td>{commonCode.createdDate}</td>
                                <td>{commonCode.useYn}</td>
                                
                                <td>
                                    <StyledButton onClick={() => {
                                        handlerModal(commonCode.groupIdx);
                                    }}>수정</StyledButton>
                                </td>
                            </tr>
                        )
                    }) : (
                        <tr>
                            <td colSpan={7}>조회결과가 없습니다.</td>
                        </tr>
                    )}
                </tbody>
            </table> */}
            
        </CommonCodeMainStyled>
    );
};
