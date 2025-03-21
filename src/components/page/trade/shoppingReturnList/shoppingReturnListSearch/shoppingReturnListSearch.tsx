import { useContext, useState } from "react";
import { StyledButton } from "../../../../common/StyledButton/StyledButton";
import { StyledSelectBox } from "../../../../common/StyledSelectBox/StyledSelectBox";
import { StyledInput } from "../../../../common/StyledInput/StyledInput";
import { ShoppingReturnListSearchStyled } from "./styled";
import { ShoppingReturnListContext } from "../../../../../api/Provider/trade/ShoppingReturnListProvider";

export const ShoppingReturnListSearch = () => {
    const options = [
        { label: "반품제품명", value: "searchProduct" },
        { label: "반품신청날짜", value: "searchReturnDate" },
    ];

    const [selectValue, setSelectValue] = useState<string>("searchProduct");
    const [inputValue, setInputValue] = useState<string>("");
    const { setSearchKeyword } = useContext(ShoppingReturnListContext);

    const handlerSearch = () => {
        setSearchKeyword({
            searchOption: selectValue,
            searchKeyword: inputValue,
        });
    };

    const handleSelectChange = (newValue: string) => {
        setSelectValue(newValue);
        setInputValue("");
    };

    return (
        <ShoppingReturnListSearchStyled>
            <StyledSelectBox options={options} value={selectValue} onChange={handleSelectChange} />

            {selectValue === "searchReturnDate" ? (
                <StyledInput
                    size='search'
                    value={inputValue}
                    type='date'
                    onChange={(e) => setInputValue(e.target.value)}
                />
            ) : (
                <StyledInput
                    size='search'
                    value={inputValue}
                    type='text'
                    onChange={(e) => setInputValue(e.target.value)}
                />
            )}

            <StyledButton variant='secondary' onClick={handlerSearch}>
                검색
            </StyledButton>
        </ShoppingReturnListSearchStyled>
    );
};
