import { useContext, useRef, useState } from "react";
import { StyledInput } from "../../../../common/StyledInput/StyledInput"
import { ProfitCheckSearchStyled } from "./styled"
import { ProfitCheckContext } from "../../../../../api/Provider/ProfitCheckProvider";
import { StyledButton } from "../../../../common/StyledButton/StyledButton";

export const ProfitCheckSearch = () => {
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const supplierName = useRef<HTMLInputElement>();
    const { setSearchKeyword } = useContext(ProfitCheckContext);

    const handlerSearch = () => {
        setSearchKeyword({
            searchKeyword: supplierName.current?.value || "",
            searchStDate: startDate || "",
            searchEdDate: endDate || ""          
        })
    }

    return (
        <ProfitCheckSearchStyled>
                🔎 기업 고객명 :
                <StyledInput size="small" ref={supplierName}/>
                📅 조회 기간 :
                <StyledInput size="small" type="date" onChange={(e) => setStartDate(e.target.value)}/>
                ~
                <StyledInput size="small" type="date" onChange={(e) => setEndDate(e.target.value)}/>
                <StyledButton variant='secondary' onClick={handlerSearch}>
                    검색
                </StyledButton>
        </ProfitCheckSearchStyled>
    )
}