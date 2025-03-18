import { useContext, useEffect, useRef, useState } from "react";
import { StyledButton } from "../../../../common/StyledButton/StyledButton";
import { StyledInput } from "../../../../common/StyledInput/StyledInput";
import { ShoppingListSearchStyled } from "./styled";
import { useNavigate } from "react-router-dom";
import { DeliveryContext } from "../../../../../api/Provider/DeliveryProvider";

export const ShoppingListSearch = () => {
    const title = useRef<HTMLInputElement>();
    const [startDate, setStartDate] = useState<string>();
    const [endDate, setEndDate] = useState<string>();
    const { setSearchKeyword } = useContext(DeliveryContext);
    const navigate = useNavigate();

    useEffect(() => {
        window.location.search && navigate(window.location.pathname, { replace: true });
    }, []);

    const handlerSearch = () => {
        setSearchKeyword({
            deliveryManager: title.current.value,
            searchStDate: startDate,
            searchEdDate: endDate,
        });
    };
    const handleKeyPress = (e) => {
        return e.key === "Enter" ? handlerSearch() : null;
    };
    return (
        <ShoppingListSearchStyled>
            배송담당자:
            <StyledInput size='small' ref={title} onKeyDown={handleKeyPress}></StyledInput>
            <StyledInput size='small' type='date' onChange={(e) => setStartDate(e.target.value)}></StyledInput>
            <StyledInput size='small' type='date' onChange={(e) => setEndDate(e.target.value)}></StyledInput>
            <StyledButton variant='secondary' onClick={handlerSearch}>
                검색
            </StyledButton>
        </ShoppingListSearchStyled>
    );
};
