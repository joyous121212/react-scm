import { WarehouseInfoContext } from "../../../../../api/Provider/WarehouseInfo/WarehouseInfoProvider";
import { WarehouseInfoProvider } from "../../../../../api/Provider/WarehouseInfo/WarehouseInfoProvider";
import { useContext, useState } from "react";
import { DetailSearchStyled } from "../../DetailCode/DetailSearch/styled";
import { StyledSelectBox } from "../../../../common/StyledSelectBox/StyledSelectBox";
import { StyledInput } from "../../../../common/StyledInput/StyledInput";
import { StyledButton } from "../../../../common/StyledButton/StyledButton";
import { CommonCodeSearchStyled } from "../../CommonCode/CommonCodeSearch/styled";
import { useRef } from "react";
import { useRecoilState } from "recoil";
import { modalState } from "../../../../../stores/modalState";
import { Portal } from "../../../../common/potal/Portal";
import { WarehouseInfoModal } from "../WarehouseInfoModal/WarehouseInfoModal";
export const WarehouseInfoSearch = () => {
    const { searchKeyword, setSearchKeyword } = useContext(WarehouseInfoContext);
    const [selectValue, setSelectValue] = useState<string>("warehouseName");
    const keywordRef = useRef<HTMLInputElement | null>(null);

    const [insertModal, setInsertModal] = useRecoilState(modalState);
    const options = [
        { label: "창고명", value: "warehouseName" },
        { label: "창고위치", value: "warehouseLocation" },
    ];

    const handlerSearch = () => {
        setSearchKeyword({
            searchTarget: selectValue,
            searchKeyword: keywordRef.current?.value || "", // 값이 없으면 빈 문자열로 대체
            currentPage: 1,
            pageSize: 5,
        });
    };

    return (
        <>
            <CommonCodeSearchStyled>
                <StyledSelectBox options={options} value={selectValue} onChange={setSelectValue} />
                <StyledInput ref={keywordRef} />
                <StyledButton onClick={handlerSearch}>검색</StyledButton>
                <StyledButton
                    onClick={() => {
                        setInsertModal(!insertModal);
                    }}
                >
                    등록
                </StyledButton>
            </CommonCodeSearchStyled>

            {insertModal ? (
                <>
                    <Portal>
                        <WarehouseInfoModal warehouseId={undefined}></WarehouseInfoModal>
                    </Portal>
                </>
            ) : (
                <></>
            )}
        </>
    );
};
