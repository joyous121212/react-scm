import { StyledSelectBox } from "../../../../common/StyledSelectBox/StyledSelectBox";
import { useContext, useEffect } from "react";
import { ProductInfoContext } from "../../../../../api/Provider/ProductInfo/ProductInfoProvider";
import { useRef, useState } from "react";
import { StyledInput } from "../../../../common/StyledInput/StyledInput";
import { StyledButton } from "../../../../common/StyledButton/StyledButton";
export const ProductInfoSearch = () => {
    //     <select id="searchOption">
    //     <option value="searchAll" selected>전체</option>
    //     <option value="searchProduct">제품명</option>
    //     <option value="searchSupplier">납품업체</option>
    // </select>

    const { searchKeyword, setSearchKeyword } = useContext(ProductInfoContext);
    const [selectValue, setSelectValue] = useState<string>("searchAll");
    const keyWordRef = useRef<HTMLInputElement>();
    const options = [
        { label: "전체", value: "searchAll" },
        { label: "제품명", value: "searchProduct" },
        { label: "납품업체", value: "searchSupplier" },
    ];

    const handlerSearch = () => {
        setSearchKeyword({
            currentPage: 1,
            pageSize: 5,
            searchKeyword: keyWordRef.current.value,
            searchOption: selectValue,
        });
    };

    useEffect(() => {
        if (selectValue === "searchAll") {
            keyWordRef.current.value = "";
        }
    }, [selectValue]);

    return (
        <>
            <StyledSelectBox options={options} value={selectValue} onChange={setSelectValue} />

            {selectValue === "searchAll" ? (
                <>
                    <StyledInput
                        placeholder='전체검색 옵션은 키워드가 필요없습니다. 원작존중 '
                        ref={keyWordRef}
                        readOnly
                    />
                </>
            ) : (
                <>
                    <StyledInput ref={keyWordRef} />
                </>
            )}

            <StyledButton onClick={handlerSearch}>검색</StyledButton>
            {/* <StyledButton onClick={handlerModal}>등록</StyledButton> */}
        </>
    );
};
