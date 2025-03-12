import { useEffect, useRef, useState } from "react";
import { StyledButton } from "../../../../common/StyledButton/StyledButton";
import { StyledInput } from "../../../../common/StyledInput/StyledInput";
import { ShoppingListSearchStyled } from "./styled";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { modalState } from "../../../../../stores/modalState";

export const ShoppingListSearch = () => {
    const title = useRef<HTMLInputElement>();
    const [startDate, setStartDate] = useState<string>();
    const [endDate, setEndDate] = useState<string>();
    const navigate = useNavigate();

    useEffect(() => {
        window.location.search && navigate(window.location.pathname, { replace: true });
    }, []);

    const handlerSearch = () => {
        // 검색 데이터를 url에 queryParam으로 옮겨 줄꺼입니다.
        const query: string[] = [];
        !title.current.value || query.push(`deliveryManager=${title.current.value}`);
        !startDate || query.push(`searchStDate=${startDate}`);
        !endDate || query.push(`searchEdDate=${endDate}`);

        const queryString = query.length > 0 ? `?${query.join("&")}` : "";
        navigate(`/react/delivery/shopping-list${queryString}`);
    };

    return (
        <ShoppingListSearchStyled>
            배송담당자
            <StyledInput size='small' ref={title}></StyledInput>
            <StyledInput size='small' type='date' onChange={(e) => setStartDate(e.target.value)}></StyledInput>
            <StyledInput size='small' type='date' onChange={(e) => setEndDate(e.target.value)}></StyledInput>
            <StyledButton variant='secondary' onClick={handlerSearch}>
                검색
            </StyledButton>
        </ShoppingListSearchStyled>
    );
};
