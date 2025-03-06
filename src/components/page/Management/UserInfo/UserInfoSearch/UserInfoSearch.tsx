import { useEffect } from "react";
import { useContext, useRef } from "react";
import { UserInfoContext } from "../../../../../api/Provider/UserInfoProvider";
import { CommonCodeSearchStyled } from "../../CommonCode/CommonCodeSearch/styled";
import { StyledButton } from "../../../../common/StyledButton/StyledButton";
import { StyledSelectBox } from "../../../../common/StyledSelectBox/StyledSelectBox";
import { StyledInput } from "../../../../common/StyledInput/StyledInput";
import { useState } from "react";
import { useRecoilState } from "recoil";
import { modalState } from "../../../../../stores/modalState";

export const UserInfoSearch = () => {
    const { searchKeyword, setSearchKeyword } = useContext(UserInfoContext);
    const [selectValue, setSelectValue] = useState<string>("name");
    const [inforAll, setInforAll] = useState<number>(0); // 체크박스 상태 관리
    const keyWordRef = useRef<HTMLInputElement>();

    const [modal, setModal] = useRecoilState(modalState);

    const options = [
        { label: "직원명/성명", value: "name" },
        { label: "담당자", value: "manager" },
        { label: "담당업무", value: "userClass" },
    ];

    const handlerSearch = () => {
        setSearchKeyword({
            groupCodeSelect: selectValue,
            searchTitle: keyWordRef.current.value,
            currentPage: 1,
            pageSize: 5,
            inforAll: inforAll,
        });
    };

    const handleCheckboxChange = () => {
        const newInforAll = inforAll === 0 ? 1 : 0;
        setInforAll(newInforAll); // 체크박스 값 변경

        // 기존 searchKeyword 을 복사해오고, 변경된 상태로 덮어씌운다.inforAll: newInforAll
        setSearchKeyword({
            ...searchKeyword,
            inforAll: newInforAll,
        });

        console.log({ ...searchKeyword, inforAll: newInforAll }); // 변경된 값 로그 찍기
    };

    const handlerModal = () => {
        setModal(!modal);
    };

    return (
        <>
            <CommonCodeSearchStyled>
                <StyledSelectBox options={options} value={selectValue} onChange={setSelectValue} />
                <StyledInput ref={keyWordRef} />
                <label>삭제된 정보 표시</label>
                <StyledInput
                    type='checkbox'
                    onChange={handleCheckboxChange} //
                />
                <StyledButton onClick={handlerSearch}>검색</StyledButton>
                <StyledButton onClick={handlerModal}>등록</StyledButton>
            </CommonCodeSearchStyled>
        </>
    );
};
