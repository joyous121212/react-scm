import { InquirySearch } from "../../components/page/Management/Inquiry/InquirySearch/InquirySearch";
import { ContentBox } from "../../components/common/ContentBox/ContentBox";
import { useEffect, useState } from "react";
import { getRoleApi } from "../../api/InquiryApi/getRoleApi";
import { InquiryInfo } from "../../api/api";
import { InquiryProvider } from "../../api/Provider/Inquiry/InquiryProvider";
import { IGetRole, IGetRoleResponse } from "../../models/interface/IInquiry";
import { useContext } from "react";
import { InquiryContext } from "../../api/Provider/Inquiry/InquiryProvider";
export const Inquiry = () => {
    const [userType, setUserType] = useState<any>();

    useEffect(() => {
        console.log(userType); // userType이 변경될 때마다 출력
    }, [userType]); // userType이 변경될 때마다 실행

    useEffect(() => {
        intiFnc();
    }, [userType]); // userType이 null일 때만 API 호출

    async function intiFnc() {
        try {
            const res: any = await getRoleApi(InquiryInfo.getRole);
            setUserType(res.userType); // API 호출 후 userType을 업데이트
        } catch (error) {
            console.error("API 호출 실패:", error);
        }
    }
    return (
        <>
            <InquiryProvider>
                <ContentBox variant='primary' fontSize='large'>
                    문의내역
                </ContentBox>
                <InquirySearch userType={userType} />
            </InquiryProvider>
        </>
    );
};
