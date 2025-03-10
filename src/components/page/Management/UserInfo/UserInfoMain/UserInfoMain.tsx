import { useEffect, useState } from "react";
import { useContext } from "react";
import { UserInfoContext } from "../../../../../api/Provider/UserInfoProvider";
import { userInfoSearchApi } from "../../../../../api/UserInfoApi/userInfoSearchApi";
import { UserInfo } from "../../../../../api/api";
import { useRecoilState } from "recoil";

import { detailModalState } from "../../../../../stores/modalState";
import { Portal } from "../../../../common/potal/Portal";
import { UserInfoModal } from "../UserInfoModal/UserInfoModal";
import { ProductsModalStyled } from "../../../Mall/Products/ProductsModal/styled";
import { StyledTable } from "../../../../common/StyledTable/StyledTable";
import { IProducts } from "../../../../../models/interface/IProducts";
import { Column } from "../../../../common/StyledTable/StyledTable";
import { StyledButton } from "../../../../common/StyledButton/StyledButton";
import { CommonCodeMainStyled } from "../../CommonCode/CommonCodeMain/styled";
import { PageNavigate } from "../../../../common/pageNavigation/PageNavigate";
import { userInfoDetailApi } from "../../../../../api/UserInfoApi/userInfoDetailApi";
import { IUserInfoDetailResponse } from "../../../../../models/interface/IUserInfo";
import { IUserDetialInfo } from "../../../../../models/interface/IUserInfo";

export const UserInfoMain = () => {
    const columns = [
        { key: "groupCode", title: "구분" },
        { key: "name", title: "성명" },
        { key: "userClass", title: "담당업무" },
        { key: "manager", title: "담당자명" },
        { key: "hp", title: "연락쳐" },
        { key: "statusYn", title: "회원상태" },
        { key: "actions", title: "비고" },
    ] as Column<any>[];

    const { searchKeyword, setSearchKeyword } = useContext(UserInfoContext);
    const [userList, setUserList] = useState(null);
    const [userInfoCnt, setUserInfoCnt] = useState(null);
    const [cPage, setCPage] = useState<number>(0);
    //모달 관리
  
const [detailModal, setDetailModal] = useRecoilState(detailModalState);
   
    //개인 정보 모달 관리
    const [isdetail,setIsdetail]=useState(false);
    //개인 정보 모달 관리
    const [loginId,setLoginId]=useState("");

    useEffect(() => {
        //  console.log(searchKeyword);
        searchUserInfo();
    }, [searchKeyword]);

    const searchUserInfo = async () => {
        const result = await userInfoSearchApi<any, any>(UserInfo.search, searchKeyword);
        //  console.log(result.userInfo);
        setUserList(result.userInfo);
        setUserInfoCnt(result.userInfoCnt);
    };

    const searchUserInfoSearchApi = async (currentPage?: number) => {
        currentPage = currentPage || 1;
        const box = { ...searchKeyword };
        box.currentPage = currentPage;
        setSearchKeyword(box);
    };


    const renderStatusYn = (statusYn: string): string => {
        console.log(`함수가 받은 값 ${statusYn}`)
        return statusYn === "1" ? "Y" : "N";
    };

    return (
        <>
            {userList != null ? (
                <>
                    <CommonCodeMainStyled>
                        <StyledTable
                            data={userList}
                            columns={columns}
                            
                            renderAction={(row) => (
                                <StyledButton
                                    size='small'
                                    onClick={async () => {
                                        console.log(row);
                                        setLoginId(row.loginID)
                                        setDetailModal(!detailModal);
                                        setIsdetail(true)
                                        
                                    }}
                                    
                                >
                                    수정
                                </StyledButton>
                            )}

                            renderCell={(row, column) => {
                                
                                // 여기서 renderCell이 존재하면 우선적으로 실행됨.
                                if (column.key === 'statusYn') {
                                    console.log(`키명: ${column.key}  값  ${row.statusYn}`)
                                    // statusYn은 renderStatusYn을 사용하여 변환
                                    return renderStatusYn(row.statusYn);
                                }
            
                                // 그 외 컬럼들은 그대로 데이터 출력
                                return row[column.key as keyof typeof row];
                            }}
                        />
                    </CommonCodeMainStyled>
                    <PageNavigate
                        totalItemsCount={userInfoCnt}
                        onChange={searchUserInfoSearchApi}
                        itemsCountPerPage={5}
                        activePage={cPage}
                    />
                </>
            ) : (
                <></>
            )}
            {detailModal  && (
               
                <Portal>
                    <UserInfoModal LoginId={loginId} isdetail={isdetail} />
                </Portal>
            )}
        </>
    );
};
