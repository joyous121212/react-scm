import { useEffect } from "react";
import { useContext, useRef } from "react";
import { UserInfoContext } from "../../../../../api/Provider/UserInfoProvider";
import { CommonCodeSearchStyled } from "../../CommonCode/CommonCodeSearch/styled";
import { StyledButton } from "../../../../common/StyledButton/StyledButton";
import { StyledSelectBox } from "../../../../common/StyledSelectBox/StyledSelectBox";
import { StyledInput } from "../../../../common/StyledInput/StyledInput";
import { useState } from "react";

export const UserInfoSearch = () => {
    const { searchKeyword, setSearchKeyword } = useContext(UserInfoContext);
    const [selectValue, setSelectValue] = useState<string>("name");
    const [inforAll, setInforAll] = useState<number>(0); // 체크박스 상태 관리
    const keyWordRef = useRef<HTMLInputElement>();
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
            inforAll: inforAll ? "1" : "0",
        });
    };

    return (
        <>
            <CommonCodeSearchStyled>
                <StyledSelectBox options={options} value={selectValue} onChange={setSelectValue} />
                <StyledInput ref={keyWordRef} />
                <label>삭제된 정보 표시</label>
                <StyledInput
                    type='checkbox'
                    onChange={() => {
                        if (!inforAll) {
                            setInforAll(0);
                        } else {
                            setInforAll(1);
                        }
                        const obj: any = { ...searchKeyword };
                        obj.inforAll = inforAll;
                        setSearchKeyword(obj);
                    }} //
                />
                <StyledButton onClick={handlerSearch}>검색</StyledButton>
            </CommonCodeSearchStyled>
        </>
    );
};
