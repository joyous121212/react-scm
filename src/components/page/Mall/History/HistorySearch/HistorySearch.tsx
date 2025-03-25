import { useContext, useRef, useState } from "react";
import { StyledButton } from "../../../../common/StyledButton/StyledButton"
import { StyledInput } from "../../../../common/StyledInput/StyledInput"
import { HistorySearchStyled } from "./styled"
import { HistoryContext } from "../../../../../api/Provider/HistoryProvider";
import { FaSync } from "react-icons/fa";

export const HistorySearch = () => {
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const title = useRef<HTMLInputElement>();
    const { setSearchKeyword } = useContext(HistoryContext);

    const handlerSearch = () => {
        setSearchKeyword({
            searchTitle: title.current?.value || "",
            searchStDate: startDate || "",
            searchEdDate: endDate || ""          
        })
    }

    const reset = () => {
        setSearchKeyword({
            searchTitle: "",
            searchStDate: "",
            searchEdDate: ""          
        });
        if (title.current !== null) {
            title.current.value = "";
        }
        setStartDate("");
        setEndDate("");
    }

    return (
        <HistorySearchStyled>
            제품명:
            <StyledInput size='small' ref={title}/>
            주문일자:
            <StyledInput size='small' type='date' value={startDate} onChange={(e) => setStartDate(e.target.value)}/>
            ~
            <StyledInput size='small' type='date' value={endDate} onChange={(e) => setEndDate(e.target.value)}/>
            <StyledButton variant='secondary' onClick={handlerSearch}>
                검색
            </StyledButton>
            <>
                <FaSync onClick={reset} className='reset' />
            </>
        </HistorySearchStyled>
    )
}