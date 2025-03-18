import { useContext, useEffect, useRef, useState } from "react";
import { OrdersReturnListContext } from "../../../../../api/Provider/OrdersReturnListProvider";
import { OrdersReturnListSearchStyled } from "./styled";
import { StyledSelectBox } from "../../../../common/StyledSelectBox/StyledSelectBox";
import { StyledInput } from "../../../../common/StyledInput/StyledInput";
import { StyledButton } from "../../../../common/StyledButton/StyledButton";

export const OrdersReturnListSearch = () => {
    const options = [
        { label: "반품회사", value: "name" },
        { label: "반품제품", value: "productName" },
    ];

    const inputValue = useRef<HTMLInputElement>();
    const [selectSupplyNameValue, setSelectSupplyNameValue] = useState<string>("name");
    const { setSearchValue } = useContext(OrdersReturnListContext);
    const [startDate, setStartDate] = useState<string>();
    const [endDate, setEndDate] = useState<string>();

    const handlerSearch = () => {
        setSearchValue({
            searchTitle: selectSupplyNameValue,
            searchKeyword: inputValue.current ? inputValue.current.value : "",
            searchStDate: startDate ? startDate : "",
            searchEdDate: endDate ? endDate : "",
        });
    };

    return (
        <OrdersReturnListSearchStyled>
            <StyledSelectBox options={options} value={selectSupplyNameValue} onChange={setSelectSupplyNameValue} />
            <StyledInput ref={inputValue} />
            <StyledInput type='date' onChange={(e) => setStartDate(e.target.value)}></StyledInput>
            <StyledInput type='date' onChange={(e) => setEndDate(e.target.value)}></StyledInput>
            <StyledButton onClick={handlerSearch}>검색</StyledButton>
        </OrdersReturnListSearchStyled>
    );
};
