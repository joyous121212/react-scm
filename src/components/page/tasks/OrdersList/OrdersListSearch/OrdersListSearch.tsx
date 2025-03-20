import { useContext, useEffect, useRef, useState } from "react";
import { OrdersListContext } from "../../../../../api/Provider/OrdersListProvider";
import { StyledSelectBox } from "../../../../common/StyledSelectBox/StyledSelectBox";
import { StyledInput } from "../../../../common/StyledInput/StyledInput";
import { StyledButton } from "../../../../common/StyledButton/StyledButton";
import { OrdersListSearchStyled } from "./styled";

export const OrdersListSearch = () => {
    const options = [
        { label: "발주회사", value: "supplyName" },
        { label: "발주제품", value: "productName" },
        { label: "승인", value: "approved" },
        { label: "미승인", value: "notApproved" },
    ];

    const inputValue = useRef<HTMLInputElement>(null);
    const [selectSupplyNameValue, setSelectSupplyNameValue] = useState<string>("supplyName");
    const { setSearchKeyword } = useContext(OrdersListContext);
    const [startDate, setStartDate] = useState<string>();
    const [endDate, setEndDate] = useState<string>();

    const handlerSearch = () => {
        setSearchKeyword({
            searchTag: selectSupplyNameValue,
            searchTitle: inputValue.current ? inputValue.current.value : "",
            searchStDate: startDate,
            searchEdDate: endDate,
        });
    };

    useEffect(() => {
        if (selectSupplyNameValue === "approved" || selectSupplyNameValue === "notApproved") {
            handlerSearch();
        }
    }, [selectSupplyNameValue]);

    return (
        <OrdersListSearchStyled>
            <StyledSelectBox options={options} value={selectSupplyNameValue} onChange={setSelectSupplyNameValue} />
            {selectSupplyNameValue !== "approved" && selectSupplyNameValue !== "notApproved" && (
                <>
                    <StyledInput ref={inputValue} />
                    <StyledInput type='date' onChange={(e) => setStartDate(e.target.value)}></StyledInput>
                    <StyledInput type='date' onChange={(e) => setEndDate(e.target.value)}></StyledInput>
                    <StyledButton onClick={handlerSearch}>검색</StyledButton>
                </>
            )}
        </OrdersListSearchStyled>
    );
};
