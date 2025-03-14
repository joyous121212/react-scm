import { ContentBox } from "../../components/common/ContentBox/ContentBox";
import { UserInfoMain } from "../../components/page/Management/UserInfo/UserInfoMain/UserInfoMain";
import { UserInfoProvider } from "../../api/Provider/UserInfoProvider";
import { UserInfoSearch } from "../../components/page/Management/UserInfo/UserInfoSearch/UserInfoSearch";
export const UserInfo = () => {
    return (
        <>
            <UserInfoProvider>
                <ContentBox variant='primary' fontSize='large'>
                    기업/ 직원 정보 관리
                </ContentBox>
                <UserInfoSearch />
                <UserInfoMain />
            </UserInfoProvider>
        </>
    );
};
