import { useEffect, useRef, useState } from "react";
import { useRecoilState } from "recoil";
import { modalState } from "../../../../../stores/modalState";
import { useNavigate } from "react-router-dom";
import { StyledButton } from "../../../../common/StyledButton/StyledButton";
import { StyledInput } from "../../../../common/StyledInput/StyledInput";
import { ShoppingSearchStyled } from "./styled";

export const ShoppingSearch = () => {
    const customerName = useRef<HTMLInputElement>();
    const [startDate, setStartDate] = useState<string>();
    const [endDate, setEndDate] = useState<string>();
    const [modal, setModal] = useRecoilState<boolean>(modalState);
    const navigate = useNavigate();

    useEffect(() => {
        window.location.search && navigate(window.location.pathname, { replace: true });
    }, []);

    const handlerSearch = () => {
        //검색 데이터를 url에 queryParam으로 옮겨 줄꺼입니다.

        const query: string[] = [];
        !customerName.current.value || query.push(`searchCustomerName=${customerName.current.value}`);
        !startDate || query.push(`searchStDate=${startDate}`);
        !endDate || query.push(`searchEdDate=${endDate}`);

        const queryString = query.length > 0 ? `?${query.join("&")}` : "";
        navigate(`/react/tasks/shopping${queryString}`);
    };
    return (
        <ShoppingSearchStyled>
            <StyledInput ref={customerName} placeholder='고객기업명을 입력해주세요.'></StyledInput>
            <StyledInput type='date' onChange={(e) => setStartDate(e.target.value)}></StyledInput>
            <StyledInput type='date' onChange={(e) => setEndDate(e.target.value)}></StyledInput>
            <StyledButton variant='secondary' onClick={handlerSearch}>
                검색
            </StyledButton>
            <StyledButton onClick={() => setModal(!modal)}>등록</StyledButton>
        </ShoppingSearchStyled>
    );
};
