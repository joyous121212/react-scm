import { InquiryContext } from "../../../../../api/Provider/Inquiry/InquiryProvider";
import { ReactHTMLElement, useContext, useEffect } from "react";
import { NoticeSearchStyled } from "../../Notice/NoticeSearch/styled";
import { StyledInput } from "../../../../common/StyledInput/StyledInput";
import { StyledButton } from "../../../../common/StyledButton/StyledButton";
import { useRef, FC } from "react";

export const InquirySearch = ({ userType }) => {
    const searchTitleRef = useRef<HTMLInputElement>();

    return (
        <>
            <NoticeSearchStyled>
                <StyledInput size='small' ref={searchTitleRef}></StyledInput>
                {/* <StyledInput size='small' type='date' onChange={(e) => setStartDate(e.target.value)}></StyledInput>
                <StyledInput size='small' type='date' onChange={(e) => setEndDate(e.target.value)}></StyledInput> */}
                <StyledButton variant='secondary'>검색</StyledButton>

                {userType != "C" ? (
                    <></>
                ) : (
                    <>
                        <StyledButton>등록</StyledButton>
                    </>
                )}
            </NoticeSearchStyled>
        </>
    );
};
