import { useRecoilState } from "recoil";
import { NoticeMain } from "../../components/page/Management/Notice/NoticeMain/NoticeMain";
import { MainStyled } from "./styled";
import { ILoginInfo } from "../../models/interface/store/userInfo";
import { loginInfoState } from "../../stores/userInfo";
import { SCMMain } from "./SCMMain/scmMain";
import { CustomerMain } from "./customerMain/customerMain";

export const Main = () => {
    const [userInfo] = useRecoilState<ILoginInfo>(loginInfoState);
    const renderMain = () => {
        switch (userInfo.userType) {
            case "S":
                return <SCMMain />;
            case "C":
                return <CustomerMain />;
        }
    };
    return (
        <MainStyled>
            {renderMain()}
            <div className='label-container'>
                <label>공지사항</label>
            </div>

            <NoticeMain />
        </MainStyled>
    );
};
