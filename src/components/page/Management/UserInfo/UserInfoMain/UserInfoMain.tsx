import { useEffect } from "react";
import { useContext } from "react";
import { UserInfoContext } from "../../../../../api/Provider/UserInfoProvider";
import { userInfoSearchApi } from "../../../../../api/UserInfoApi/userInfoSearchApi";
import { UserInfo } from "../../../../../api/api";
import { useRecoilState } from "recoil";
import { modalState } from "../../../../../stores/modalState";
import { Portal } from "../../../../common/potal/Portal";
import { UserInfoModal } from "../UserInfoModal/UserInfoModal";
export const UserInfoMain = () => {
    const { searchKeyword } = useContext(UserInfoContext);

    //모달 관리
    const [modal, setModal] = useRecoilState(modalState);

    useEffect(() => {
        console.log(searchKeyword);
        searchUserInfo();
    }, [searchKeyword]);

    const searchUserInfo = async () => {
        const result = await userInfoSearchApi<any, any>(UserInfo.search, searchKeyword);
        console.log(result.userInfo);
    };

    return (
        <>
            {modal && (
                <Portal>
                    <UserInfoModal />
                </Portal>
            )}
        </>
    );
};
