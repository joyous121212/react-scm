import { useEffect, useState } from "react";
import { useContext } from "react";
import { UserInfoContext } from "../../../../../api/Provider/UserInfoProvider";
import { userInfoSearchApi } from "../../../../../api/UserInfoApi/userInfoSearchApi";
import { UserInfo } from "../../../../../api/api";
import { useRecoilState } from "recoil";
import { modalState } from "../../../../../stores/modalState";
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
    const [modal, setModal] = useRecoilState(modalState);
    const [userDetail, setUserDetail] = useState<IUserDetialInfo>({
        user_type: "",
        classType: "",
        statusYn: "",
        group_code: "",
        detail_code: "",
        loginID: "",
        password: "",
        password1: "",
        name: "",
        manager: "",
        hp: "",
        userTel1: "",
        userTel2: "",
        userTel3: "",
        birthday: "",
        user_email: "",
        user_zipcode: "",
        user_address: "",
        user_dt_address: "",
        detailCode: "",
        userClass: "",
        sex: "",
        email: "",
        zipCode: "",
        address: "",
        ph: "",
    });

    useEffect(() => {
        console.log("-----제거확인----");
        console.log(userDetail);
        console.log("-----제거확인----");
    }, [userDetail]);

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
                                        const res: IUserInfoDetailResponse = await userInfoDetailApi(
                                            UserInfo.userInfoDetail,
                                            { loginID: row.loginID }
                                        );
                                        console.log(res.detailValue);
                                        setUserDetail(res.detailValue);
                                        setModal(!modal);
                                    }}
                                >
                                    수정
                                </StyledButton>
                            )}
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

            {modal && userDetail === undefined && (
                <Portal>
                    <UserInfoModal detailInfo={userDetail} isdetail={false} />
                </Portal>
            )}

            {userDetail != undefined && modal && (
                <Portal>
                    <UserInfoModal detailInfo={userDetail} isdetail={true} />
                </Portal>
            )}
        </>
    );
};
