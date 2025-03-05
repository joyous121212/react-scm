import { useEffect } from "react";
import { useContext } from "react";
import { UserInfoContext } from "../../../../../api/Provider/UserInfoProvider";
import { userInfoSearchApi } from "../../../../../api/UserInfoApi/userInfoSearchApi";
import { UserInfo } from "../../../../../api/api";
export const UserInfoMain = () => {
    const { searchKeyword } = useContext(UserInfoContext);

    useEffect(() => {
        console.log(searchKeyword);
        searchUserInfo();
    }, [searchKeyword]);

    const searchUserInfo = async () => {
        const result = await userInfoSearchApi<any, any>(UserInfo.search, searchKeyword);
        console.log(result.userInfo);
    };

    return <></>;
};
