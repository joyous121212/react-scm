import { useContext, useRef, useState } from "react";
import { CommonCodeCotext } from "../../../../../api/Provider/CommonCodeProvider";
import { useRecoilState } from "recoil";
import { modalState } from "../../../../../stores/modalState";
import { OrdersListSearchStyled } from "./styled";
import { StyledSelectBox } from "../../../../common/StyledSelectBox/StyledSelectBox";
import { StyledInput } from "../../../../common/StyledInput/StyledInput";
import { StyledButton } from "../../../../common/StyledButton/StyledButton";

export const OrdersListSearch = () => {
    const options = [
        { label: "제품명", value: "productName" },
        { label: "발주업체", value: "supplyName" },
    ];

    const [selectValue, setSelectValue] = useState<string>("productName");
    const inputValue = useRef<HTMLInputElement>();
    const { setSearchKeyword } = useContext(CommonCodeCotext);
    const [modal, setModal] = useRecoilState(modalState);

    const handlerSearch = () => {
        setSearchKeyword({
            supplyNameSelect: selectValue,
            searchTitle: inputValue.current.value,
        });
    };

    return (
        <OrdersListSearchStyled>
            <StyledSelectBox options={options} value={selectValue} onChange={setSelectValue} />
            <StyledInput ref={inputValue} />
            <StyledButton onClick={handlerSearch}>검색</StyledButton>
        </OrdersListSearchStyled>
    );
};
