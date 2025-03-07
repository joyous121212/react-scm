import { useContext, useRef, useState } from "react";
import { OrderListContext } from "../../../../../api/Provider/OrderListProvider";
import { OrdersListSearchStyled } from "./styled";
import { StyledSelectBox } from "../../../../common/StyledSelectBox/StyledSelectBox";
import { StyledInput } from "../../../../common/StyledInput/StyledInput";
import { StyledButton } from "../../../../common/StyledButton/StyledButton";

export const OrdersListSearch = () => {
    const options = [
        { label: "제품명", value: "productName" },
        { label: "발주업체명", value: "supplyName" },
    ];

    const inputValue = useRef<HTMLInputElement>();
    const [selectProductNameValue, setselectProductNameValue] = useState<string>("productName");
    const { setSearchKeyword } = useContext(OrderListContext);

    const handlerSearch = () => {
        setSearchKeyword({
            searchTag: selectProductNameValue,
            searchTitle: inputValue.current.value,
        });
    };

    return (
        <OrdersListSearchStyled>
            <StyledSelectBox options={options} value={selectProductNameValue} onChange={setselectProductNameValue} />
            <StyledInput ref={inputValue} />
            <StyledButton onClick={handlerSearch}>검색</StyledButton>
        </OrdersListSearchStyled>
    );
};
