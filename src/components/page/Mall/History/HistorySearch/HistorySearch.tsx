import { useContext, useRef, useState } from "react";
import { StyledButton } from "../../../../common/StyledButton/StyledButton"
import { StyledInput } from "../../../../common/StyledInput/StyledInput"
import { HistorySearchStyled } from "./styled"
import { HistoryContext } from "../../../../../api/Provider/HistoryProvider";

export const HistorySearch = () => {
    const [startDate, setStartDate] = useState<string>();
    const [endDate, setEndDate] = useState<string>();
    const title = useRef<HTMLInputElement>();
    const { setSearchKeyword } = useContext(HistoryContext);

    const handlerSearch = () => {
        setSearchKeyword({
            searchTitle: title.current?.value || "",
            searchStDate: startDate || "",
            searchEdDate: endDate || ""          
        })
    }

    return (
        <HistorySearchStyled>
            제품명:
            <StyledInput size='small' ref={title}/>
            주문일자:
            <StyledInput size='small' type='date' ref={startDate}/>
            ~
            <StyledInput size='small' type='date' ref={endDate}/>
            <StyledButton variant='secondary' onClick={handlerSearch}>
                검색
            </StyledButton>
        </HistorySearchStyled>
    )
}