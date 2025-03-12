import { useEffect, useRef, useState } from "react";
import { StyledButton } from "../../../../common/StyledButton/StyledButton";
import { StyledInput } from "../../../../common/StyledInput/StyledInput";
import { ShoppingReturnListSearchStyled } from "./styled";
import { useNavigate } from "react-router-dom";

export const ShoppingReturnListSearchDe = () => {
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
        !title.current.value || query.push(`searchKeyword=${title.current.value}`);
        !startDate || query.push(`searchStDate=${startDate}`);
        !endDate || query.push(`searchEdDate=${endDate}`);

        const queryString = query.length > 0 ? `?${query.join("&")}` : "";
        navigate(`/react/delivery/shopping-return-list${queryString}`);
    };

    return (
        <ShoppingReturnListSearchStyled>
            업체명
            <StyledInput size='small' ref={title}></StyledInput>
            <StyledInput size='small' type='date' onChange={(e) => setStartDate(e.target.value)}></StyledInput>
            <StyledInput size='small' type='date' onChange={(e) => setEndDate(e.target.value)}></StyledInput>
            <StyledButton variant='secondary' onClick={handlerSearch}>
                검색
            </StyledButton>
        </ShoppingReturnListSearchStyled>
    );
};
