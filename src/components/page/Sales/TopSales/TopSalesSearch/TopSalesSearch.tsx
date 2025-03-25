import { useContext, useEffect, useState } from "react"
import { StyledButton } from "../../../../common/StyledButton/StyledButton"
import { TopSalesSearchStyled } from "./styled"
import { TopSales } from "../../../../../api/api"
import { TopSalesContext } from "../../../../../api/Provider/TopSalesProvider"
import { searchApi } from "../../../../../api/SalesApi/searchApi"
import { FaSync } from "react-icons/fa"

export const TopSalesSearch = () => {    
    const [minYearValue, setMinYearValue] = useState<number>();
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    const [selectYearValue, setSelectYearValue] = useState<string>(String(currentYear));  
    const [selectMonthValue, setSelectMonthValue] = useState<string>(String(currentMonth));  
    const { setSearchKeyword } = useContext(TopSalesContext);

    useEffect(() => {
        selectDate(); 
        setSearchKeyword({
            searchYear: String(currentYear),
            searchMonth: String(currentMonth),
        });
    }, []);    

    const selectDate = async () => {
        const result = await searchApi<{minYear: number}>(TopSales.selectDate, {});
        console.log("result.minYear", result.minYear);
        if(result) {
            setMinYearValue(result.minYear);
        }
    };

    const handlerSearch = () => {
        setSearchKeyword({
            searchYear: selectYearValue,
            searchMonth: selectMonthValue
        })
    };

    const reset = () => {
        setSearchKeyword({
            searchYear: String(currentYear),
            searchMonth: String(currentMonth),
        });
        setSelectYearValue(String(currentYear));
        setSelectMonthValue(String(currentMonth));
    };

    return (
        <TopSalesSearchStyled>
            📅 조회 년월:
            <select 
                id="searchYear"
                value={selectYearValue} 
                onChange={(e) => setSelectYearValue(e.target.value)}
                className="searchYear"
            >
                <option value="">년도</option>
                {minYearValue !== null &&
                    Array.from({ length: currentYear - minYearValue + 1 }, (_, index) => {
                        const year = minYearValue + index;
                        return (
                            <option key={year} value={year}>
                                {year}년
                            </option>
                        );
                    })}
            </select>
            <select 
                id="searchMonth"
                value={selectMonthValue} 
                onChange={(e) => setSelectMonthValue(e.target.value)}
                className="searchMonth"
            >
                <option value="">월</option>
                {Array.from({ length: 12 }, (_, index) => {
                    const month = index + 1;
                    return (
                        <option key={month} value={month}>
                            {month}월
                        </option>
                    );
                })}
            </select>
            <StyledButton variant='secondary' onClick={handlerSearch}>
                검색
            </StyledButton>
            <>
                <FaSync onClick={reset} className='reset' />
            </>
        </TopSalesSearchStyled>
    )
}