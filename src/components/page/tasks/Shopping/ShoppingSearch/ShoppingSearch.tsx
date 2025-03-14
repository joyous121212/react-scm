import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { StyledButton } from "../../../../common/StyledButton/StyledButton";
import { StyledInput } from "../../../../common/StyledInput/StyledInput";
import { ShoppingSearchStyled } from "./styled";
import { ShoppingContext } from "../../../../../api/Provider/ShoppingProvider";

export const ShoppingSearch = () => {
    // const customerName = useRef<HTMLInputElement>();
    const customerName = useRef<HTMLInputElement>();
    const [startDate, setStartDate] = useState<string>();
    const [endDate, setEndDate] = useState<string>();
    const { setSearchKeyword } = useContext(ShoppingContext);

    const handlerSearch = () => {
        setSearchKeyword({
            customerName: customerName.current.value,
            searchStDate: startDate,
            searchEdDate: endDate,
        });
    };

    return (
        <ShoppingSearchStyled>
            <StyledInput ref={customerName} placeholder='고객기업명을 입력해주세요.' />
            <StyledInput type='date' onChange={(e) => setStartDate(e.target.value)}></StyledInput>
            <StyledInput type='date' onChange={(e) => setEndDate(e.target.value)}></StyledInput>
            <StyledButton variant='secondary' onClick={handlerSearch}>
                검색
            </StyledButton>
        </ShoppingSearchStyled>
    );
};
