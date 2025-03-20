import { useContext, useEffect, useRef, useState } from "react";
import { ShoppingReturnContext } from "../../../../../api/Provider/ShoppingReturnProvider";
import { ShoppingReturnSearchStyled } from "./styled";
import { StyledSelectBox } from "../../../../common/StyledSelectBox/StyledSelectBox";
import { StyledInput } from "../../../../common/StyledInput/StyledInput";
import { StyledButton } from "../../../../common/StyledButton/StyledButton";

export const ShoppingReturnSearch = () => {
    const options = [
        { label: "제품명", value: "productName" },
        { label: "SCM승인대기중", value: "approved0" },
        { label: "임원승인대기중", value: "approved1" },
        { label: "임원승인완료", value: "approved2" },
        { label: "창고이동완료", value: "approved3" },
    ];

    const searchKeyword = useRef<HTMLInputElement>();
    const [selectProductName, setSelectProductName] = useState<string>("productName");
    const { setSearchValue } = useContext(ShoppingReturnContext);
    const [startDate, setStartDate] = useState<string>();
    const [endDate, setEndDate] = useState<string>();

    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        if (["approved0", "approved1", "approved2", "approved3"].includes(selectProductName)) {
            handlerSearch();
        } else {
            handlerSearch();
        }
    }, [selectProductName]);

    const handlerSearch = () => {
        setSearchValue({
            searchTag: selectProductName,
            searchKeyword: searchKeyword.current?.value || "",
            searchStDate: startDate,
            searchEdDate: endDate,
        });
    };

    return (
        <ShoppingReturnSearchStyled>
            <StyledSelectBox options={options} value={selectProductName} onChange={setSelectProductName} />
            {selectProductName !== "approved0" &&
                selectProductName !== "approved1" &&
                selectProductName !== "approved2" &&
                selectProductName !== "approved3" && (
                    <>
                        <StyledInput ref={searchKeyword} placeholder='제품명을 입력해주세요.' />
                        <StyledInput type='date' onChange={(e) => setStartDate(e.target.value)}></StyledInput>
                        <StyledInput type='date' onChange={(e) => setEndDate(e.target.value)}></StyledInput>
                        <StyledButton onClick={handlerSearch}>검색</StyledButton>
                    </>
                )}
        </ShoppingReturnSearchStyled>
    );
};
