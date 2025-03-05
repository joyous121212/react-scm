import { useRef, useState } from "react";
import { StyledSelectBox } from "../../../../common/StyledSelectBox/StyledSelectBox";
import { ProductsSearchStyled } from "./styled"
import { StyledButton } from "../../../../common/StyledButton/StyledButton";
import { StyledInput } from "../../../../common/StyledInput/StyledInput";

export const ProductsSearch = () => {
    const title = useRef<HTMLInputElement>();
    const options = [
        { label: "서버", value: "" },
        { label: "UPS", value: "" },
        { label: "외부장비", value: "" },
    ];

    const [selectValue, setSelectValue] = useState<string>("전체");

    const handlerSearch = () => {
        const query: string[] = [];

    }

    return (
        <ProductsSearchStyled>
            제품 분류:
            <StyledSelectBox options={options} value={selectValue} onChange={setSelectValue}></StyledSelectBox>
            제조사:
            <StyledSelectBox options={options} value={selectValue} onChange={setSelectValue}></StyledSelectBox>
            제품명:
            <StyledInput ref={title}/>
            <StyledButton variant='secondary' onClick={handlerSearch}>검색</StyledButton>
        </ProductsSearchStyled>
    )
}