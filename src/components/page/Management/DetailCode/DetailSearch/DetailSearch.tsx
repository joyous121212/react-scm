import { useContext, useRef, useState } from "react";
import { StyledButton } from "../../../../common/StyledButton/StyledButton";
import { StyledSelectBox } from "../../../../common/StyledSelectBox/StyledSelectBox";
import { DetailSearchStyled } from "./styled";
import { StyledInput } from "../../../../common/StyledInput/StyledInput";
import { CommonDetailCodeContext } from "../../../../../api/Provider/CommonDetailCodeProvider";

export const DetailSearch = () => {
    // 검색을 데이터
    const [selectValue, setSelectValue] = useState<string>("detailCodeName");
    const inputValue = useRef<HTMLInputElement>();

    // 검색 데이터에 담긴 값을 provider를 사용해서 searchKeyword의 값으로 전달해줌
    const { setSearchKeyword } = useContext(CommonDetailCodeContext);

    const options = [
        { label: "상세코드명", value: "detailCodeName" },
        { label: "상세코드", value: "detailCode" },
    ];

    const handlerSearch = () => {
        setSearchKeyword({ detailCodeSearchTitle: inputValue.current.value, detailCodeSelect: selectValue });
    };

    return (
        <DetailSearchStyled>
            <StyledSelectBox options={options} value={selectValue} onChange={setSelectValue} />
            <StyledInput ref={inputValue} />
            <StyledButton onClick={handlerSearch}>검색</StyledButton>
            <StyledButton>등록</StyledButton>
        </DetailSearchStyled>
    );
};
