import { InquiryContext } from "../../../../../api/Provider/Inquiry/InquiryProvider";
import { ReactHTMLElement, useContext, useEffect } from "react";
import { NoticeSearchStyled } from "../../Notice/NoticeSearch/styled";
import { StyledInput } from "../../../../common/StyledInput/StyledInput";
import { StyledButton } from "../../../../common/StyledButton/StyledButton";
import { useRef, FC } from "react";
import { useRecoilState } from "recoil";
import { modalState } from "../../../../../stores/modalState";

export const InquirySearch = () => {
    const userInfo = sessionStorage.getItem("userInfo");
    const { userType } = JSON.parse(userInfo);
    const [modal, setMoal] = useRecoilState(modalState);
    const searchTitleRef = useRef<HTMLInputElement>();
    const searchStDateRef = useRef<HTMLInputElement>();
    const searchEdDateRef = useRef<HTMLInputElement>();
    const { searchKeyword, setSearchKeyword } = useContext(InquiryContext);

    const handleDateChange = () => {
        const startDate = new Date(searchStDateRef.current.value);
        const endDate = new Date(searchEdDateRef.current.value);

        // 만약 종료일이 시작일보다 더 빠르면 경고창 띄우기
        if (endDate < startDate) {
            alert("종료일은 시작일보다 더 빠를 수 없습니다!");
            searchStDateRef.current.value = "";
            searchEdDateRef.current.value = "";
        }
    };

    const handleSearchTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        //console.log(`name: ${name} value: ${value}`);
        searchTitleRef.current.value = value;
    };

    const goSearch = () => {
        const box = { ...searchKeyword };
        box.searchTitle = searchTitleRef.current.value;
        box.searchStDate = searchStDateRef.current.value;
        box.searchEdDate = searchEdDateRef.current.value;

        setSearchKeyword(box);
    };

    return (
        <>
            <NoticeSearchStyled>
                제목: <StyledInput size='small' ref={searchTitleRef} onChange={handleSearchTitle}></StyledInput>
                기간:
                <StyledInput size='small' type='date' ref={searchStDateRef} onChange={handleDateChange}></StyledInput>
                <StyledInput size='small' type='date' ref={searchEdDateRef} onChange={handleDateChange}></StyledInput>
                {/* <StyledInput size='small' type='date' onChange={(e) => setStartDate(e.target.value)}></StyledInput>
                <StyledInput size='small' type='date' onChange={(e) => setEndDate(e.target.value)}></StyledInput> */}
                <StyledButton variant='secondary' onClick={goSearch}>
                    검색
                </StyledButton>
                {/* userType 나중 팀원이 리코일로 userType 세팅해주면 여기 분기점으로 수정하라. */}
                {userType != undefined && userType === "C" ? (
                    <>
                        <StyledButton onClick={() => setMoal(!modal)}>등록</StyledButton>
                    </>
                ) : (
                    <></>
                )}
            </NoticeSearchStyled>
        </>
    );
};
