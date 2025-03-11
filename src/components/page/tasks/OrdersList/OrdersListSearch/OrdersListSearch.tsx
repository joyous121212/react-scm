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

    const inputValue = useRef<HTMLInputElement>();
    const [selectSupplyNameValue, setSelectSupplyNameValue] = useState<string>("supplyName");
    const { setSearchKeyword } = useContext(OrdersListContext);

    const handlerSearch = () => {
        setSearchKeyword({
            searchTag: selectSupplyNameValue,
            searchTitle: inputValue.current ? inputValue.current.value : "",
        });
    };

    // 승인/미승인 선택 시 자동 검색
    useEffect(() => {
        if (selectSupplyNameValue === "approved" || selectSupplyNameValue === "notApproved") {
            // 승인/미승인일 경우 자동 검색
            setSearchKeyword({ searchTag: selectSupplyNameValue, searchTitle: "" });
        } else {
            // 다른 옵션 선택 시 전체 리스트로 돌아가기
            setSearchKeyword({ searchTag: selectSupplyNameValue, searchTitle: "" });
        }
    }, [selectSupplyNameValue]);

    return (
        <OrdersListSearchStyled>
            <StyledSelectBox options={options} value={selectSupplyNameValue} onChange={setSelectSupplyNameValue} />
            {selectSupplyNameValue !== "approved" && selectSupplyNameValue !== "notApproved" && (
                <>
                    <StyledInput ref={inputValue} />
                    <StyledButton onClick={handlerSearch}>검색</StyledButton>
                </>
            )}
        </OrdersListSearchStyled>
    );
};
