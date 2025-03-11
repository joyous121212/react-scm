import { useState } from "react";
import { StyledSelectBox } from "../../../../common/StyledSelectBox/StyledSelectBox"
import { HistoryDetailModalStyle } from "./styled"
import { StyledButton } from "../../../../common/StyledButton/StyledButton";
import { useRecoilState } from "recoil";
import { modalState } from "../../../../../stores/modalState";
import { StyledInput } from "../../../../common/StyledInput/StyledInput";
import { History } from "../../../../../api/api";
import { postApi } from "../../../../../api/MallApi/postApi";

export const HistoryDetailModal = ( {orderId, returnCount, postSuccess} ) => {
    const [selectValue, setSelectValue] = useState<string>("");
    const [modal, setModal] = useRecoilState(modalState);
    const [bank, setBank] = useState<string>("");
    const [accountNumber, setAccountNumber] = useState<string>("");
    const [accountHolder, setAccountHolder] = useState<string>("");

    const options = [
        { label: "은행 선택", value: "" },
        { label: "신한", value: "088" },
        { label: "우리", value: "020" },
    ];

    const salesReturn = async() => {
        const result = await postApi(History.returnSave, {
            orderId,
            count: returnCount,
            bank,
            accountNumber,
            accountHolder,
        });

        if (result.result === "success") {
            alert("반품 처리되었습니다.");
            postSuccess();
        }
    }

    return (
        <HistoryDetailModalStyle>
            <div className="container">
                <label>
                    은행 선택
                    <StyledSelectBox 
                        value={selectValue}
                        options={options}
                        onChange={setSelectValue}
                    />
                    계좌번호
                    <StyledInput type='text' onChange={(e) => setAccountNumber(e.target.value)}/>
                    예금주
                    <StyledInput type='text' onChange={(e) => setAccountHolder(e.target.value)}/>
                </label>
                <div className={"button-container"}>
                    <StyledButton onClick={salesReturn}>반품</StyledButton>
                    <StyledButton onClick={() => setModal(!modal)}>취소</StyledButton>
                </div>
            </div>
            
        </HistoryDetailModalStyle>
    )
}