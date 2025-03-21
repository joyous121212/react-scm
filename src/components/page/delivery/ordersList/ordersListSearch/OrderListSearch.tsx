import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingListSearchStyled } from "../../shoppingList/ShoppingListSearch/styled";
import { StyledInput } from "../../../../common/StyledInput/StyledInput";
import { StyledButton } from "../../../../common/StyledButton/StyledButton";
import { StyledSelectBox } from "../../../../common/StyledSelectBox/StyledSelectBox";
import { DeliveryContext } from "../../../../../api/Provider/DeliveryProvider";
import { FaSync } from "react-icons/fa";

export const OrderListSearch = () => {
    const title = useRef<HTMLInputElement>();
    const [startDate, setStartDate] = useState<string>();
    const { setSearchKeyword } = useContext(DeliveryContext);
    const navigate = useNavigate();
    const options = [
        { label: "업체명", value: "searchUser" },
        { label: "발주처리일", value: "searchOrderDate" },
    ];
    const [selectValue, setSelectValue] = useState<string>("searchUser");

    useEffect(() => {
        window.location.search && navigate(window.location.pathname, { replace: true });
    }, []);

    useEffect(() => {
        if (title.current !== null) {
            title.current.value = "";
        }
    }, [selectValue]);

    const handlerSearch = () => {
        setSearchKeyword({
            searchOption: selectValue,
            searchKeyword: selectValue === "searchUser" ? title.current.value : startDate,
        });
    };
    const handleKeyPress = (e) => {
        return e.key === "Enter" ? handlerSearch() : null;
    };
    const reset = () => {
        if (title.current !== null) {
            title.current.value = "";
        }
        setStartDate("");
        setSearchKeyword({});
    };

    return (
        <ShoppingListSearchStyled>
            <StyledSelectBox options={options} value={selectValue} onChange={setSelectValue} />
            {selectValue === "searchUser" ? (
                <StyledInput size='medium' ref={title} onKeyDown={handleKeyPress}></StyledInput>
            ) : (
                <StyledInput
                    size='medium'
                    value={startDate}
                    type='date'
                    onChange={(e) => setStartDate(e.target.value)}
                ></StyledInput>
            )}
            <FaSync onClick={reset} className='reset' />
            <StyledButton variant='secondary' onClick={handlerSearch}>
                검색
            </StyledButton>
        </ShoppingListSearchStyled>
    );
};
