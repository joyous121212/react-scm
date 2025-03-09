import { StyledSelectBox } from "../../../../common/StyledSelectBox/StyledSelectBox"
import { CommonCodeSearchStyled } from "../../CommonCode/CommonCodeSearch/styled"
import { StyledInput } from "../../../../common/StyledInput/StyledInput"

import { SupplierInfoContext } from "../../../../../api/Provider/SupplierInfoProvider"
import { useRef, useState ,useContext, useEffect} from "react"
import { StyledButton } from "../../../../common/StyledButton/StyledButton"
export const SupplierInfoSearch=()=>{

const {searchKeyword, setSearchKeyword}= useContext(SupplierInfoContext);
const keyWordRef = useRef<HTMLInputElement>();
const [selectValue, setSelectValue] = useState<string>("searchSupplier");

    const options = [
        { label: "납품업체명", value: "searchSupplier" },
        { label: "제품명", value: "searchProduct" },     
    ];

    const handlerSearch = () => {
      setSearchKeyword({
        searchOption: selectValue,
        searchKeyword:keyWordRef.current?.value,
        currentPage: 1,
        pageSize: 5,
      });
  };
    return(<>
                <CommonCodeSearchStyled>
                    <StyledSelectBox options={options} value={selectValue} onChange={setSelectValue} />
                    <StyledInput ref={keyWordRef} />                    
                    <StyledButton onClick={handlerSearch}>검색</StyledButton>
                    {/* <StyledButton onClick={handlerModal}>등록</StyledButton> */}
                </CommonCodeSearchStyled>
    </>)
}