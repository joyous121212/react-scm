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
export const UserInfoMain = () => {
    const columns = [
        { key: "groupCode", title: "구분" },
        { key: "name", title: "성명" },
        { key: "userClass", title: "담당업무" },
        { key: "name", title: "담당자명" },
        { key: "hp", title: "연락쳐" },
        { key: "statusYn", title: "회원상태" },
        { key: "수정", title: "비고" },
    ] as Column<IProducts>[];

    const { searchKeyword } = useContext(UserInfoContext);
    const [userList, setUserList] = useState(null);
    //모달 관리
    const [modal, setModal] = useRecoilState(modalState);

    useEffect(() => {
        console.log(searchKeyword);
        searchUserInfo();
    }, [searchKeyword]);

    const searchUserInfo = async () => {
        const result = await userInfoSearchApi<any, any>(UserInfo.search, searchKeyword);
        console.log(result.userInfo);
        setUserList(result.userInfo);
    };

    return (
        <>
            {userList != null ? (
                <>
                    <StyledTable data={userList} columns={columns} />
                </>
            ) : (
                <></>
            )}

            {modal && (
                <Portal>
                    <UserInfoModal />
                </Portal>
            )}
        </>
    );
};
