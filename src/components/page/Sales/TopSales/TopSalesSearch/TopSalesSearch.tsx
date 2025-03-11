import { useEffect, useState } from "react"
import { StyledButton } from "../../../../common/StyledButton/StyledButton"
import { StyledSelectBox } from "../../../../common/StyledSelectBox/StyledSelectBox"
import { TopSalesSearchStyled } from "./styled"
import { TopSales } from "../../../../../api/api"
import { getApi } from "../../../../../api/SalesApi/getApi"

export const TopSalesSearch = () => {    
    const [minYear, setMinYear] = useState<number>();
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    const [selectYearValue, setSelectYearValue] = useState<string>(String(currentYear));   
    const [selectMonthValue, setSelectMonthValue] = useState<string>(String(currentMonth));  

    useEffect(() => {
        selectDate(); 
        console.log(currentMonth);    
    }, []);

    const selectDate = async () => {
        const result = await getApi<{minYear: number}>(TopSales.selectDate, {});
        if(result) {
            setMinYear(Number(result));
        }
    };

    const optionsYear = [
            {label: "년도", value: ""},
            ...Array.from(
            { length: Math.max(1, currentYear - minYear + 1) }, // 최소 1개의 옵션이 있도록 보장
            (_, index) => {
                const year = minYear + index;
                return { label: `${year}년`, value: `${year}` };
            }
        )
    ];

    const optionsMonth = [
        {label: "년월", value: ""},
        ...Array.from(
            { length: 12 },
            (_, index) => {
                const month = index + 1;
                return { label: `${month}월`, value: `${month}` };
            }
        )
    ]

    return (
        <TopSalesSearchStyled>
            조회 년월:
            <StyledSelectBox options={optionsYear} value={String(currentYear)} onChange={setSelectYearValue}/>
            <StyledSelectBox options={optionsMonth} value={String(currentMonth)} onChange={setSelectMonthValue}/>
            <StyledButton variant='secondary'>
                검색
            </StyledButton>
        </TopSalesSearchStyled>
    )
}