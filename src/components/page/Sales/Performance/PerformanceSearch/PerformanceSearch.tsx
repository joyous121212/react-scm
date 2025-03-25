import { useContext, useRef, useState } from "react";
import { StyledInput } from "../../../../common/StyledInput/StyledInput"
import { PerformanceSearchStyled } from "./styled"
import { PerformanceContext } from "../../../../../api/Provider/PerformanceProvider";
import { StyledButton } from "../../../../common/StyledButton/StyledButton";
import { FaSync } from "react-icons/fa";

export const PerformanceSearch = () => {
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const supplierName = useRef<HTMLInputElement>();
    const { setSearchKeyword } = useContext(PerformanceContext);

    const handlerSearch = () => {
        setSearchKeyword({
            searchKeyword: supplierName.current?.value || "",
            searchStDate: startDate || "",
            searchEdDate: endDate || ""          
        })
    };

    const reset = () => {
        setSearchKeyword({
            searchKeyword: "",
            searchStDate: "",
            searchEdDate: ""          
        })
        if (supplierName.current !== null) {
            supplierName.current.value = "";
        }
        setStartDate("");
        setEndDate("");
    };

    return (
        <PerformanceSearchStyled>
            🔎 기업 고객명 :
            <StyledInput size="small" ref={supplierName}/>
            📅 조회 기간 :
            <StyledInput size="small" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}/>
            ~
            <StyledInput size="small" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}/>
            <StyledButton variant='secondary' onClick={handlerSearch}>
                검색
            </StyledButton>
            <>
                <FaSync onClick={reset} className='reset' />
            </>
        </PerformanceSearchStyled>
    )
}