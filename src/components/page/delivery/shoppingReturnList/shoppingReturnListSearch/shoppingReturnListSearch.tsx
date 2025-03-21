import { useContext, useEffect, useRef, useState } from "react";
import { StyledButton } from "../../../../common/StyledButton/StyledButton";
import { StyledInput } from "../../../../common/StyledInput/StyledInput";
import { ShoppingReturnListSearchStyled } from "./styled";
import { useNavigate } from "react-router-dom";
import { DeliveryContext } from "../../../../../api/Provider/DeliveryProvider";
import { FaSync } from "react-icons/fa";

export const ShoppingReturnListSearchDe = () => {
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
            searchKeyword: title.current.value,
            searchStDate: startDate,
            searchEdDate: endDate,
        });
    };
    const handleKeyPress = (e) => {
        return e.key === "Enter" ? handlerSearch() : null;
    };
    const reset = () => {
        title.current.value = "";
        setStartDate("");
        setEndDate("");
        setSearchKeyword({});
    };
    return (
        <ShoppingReturnListSearchStyled>
            업체명:
            <StyledInput size='small' ref={title} onKeyDown={handleKeyPress}></StyledInput>
            <StyledInput
                size='small'
                value={startDate}
                type='date'
                onChange={(e) => setStartDate(e.target.value)}
            ></StyledInput>
            <StyledInput
                size='small'
                value={endDate}
                type='date'
                onChange={(e) => setEndDate(e.target.value)}
            ></StyledInput>
            <FaSync onClick={reset} className='reset' />
            <StyledButton variant='secondary' onClick={handlerSearch}>
                검색
            </StyledButton>
        </ShoppingReturnListSearchStyled>
    );
};
