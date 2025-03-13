import { useContext, useRef, useState } from "react";
import { StyledButton } from "../../../../common/StyledButton/StyledButton";
import { StyledSelectBox } from "../../../../common/StyledSelectBox/StyledSelectBox";
import { StyledInput } from "../../../../common/StyledInput/StyledInput";
import { ShoppingOrdersStyled } from "./styled";
import { ShoppingOrdersContext } from "../../../../../api/Provider/trade/ShoppingOrdersProvider";

export const ShoppingOrdersSearch = () => {
    const options = [
        { label: "주문일자로 조회", value: "searchSalesDate" },
        { label: "반품일자로 조회", value: "searchReturnDate" },
    ];
    const [selectValue, setSelectValue] = useState<string>("searchSalesDate");
    const inputValue = useRef<HTMLInputElement>();
    const { setSearchKeyword } = useContext(ShoppingOrdersContext);

    const handlerSearch = () => {
        if (!inputValue) return;

        setSearchKeyword({
            searchOption: selectValue,
            searchKeyword: inputValue.current.value,
        });
    };

    return (
        <ShoppingOrdersStyled>
            {/* Select Box */}
            <StyledSelectBox options={options} value={selectValue} onChange={setSelectValue} />
            {/* Input 필드 변경 */}
            <StyledInput size='search' ref={inputValue} type='date'/>
            {/* 검색 버튼 */}
            <StyledButton variant='secondary' onClick={handlerSearch}>
                검색
            </StyledButton>
        </ShoppingOrdersStyled>
    );
};
