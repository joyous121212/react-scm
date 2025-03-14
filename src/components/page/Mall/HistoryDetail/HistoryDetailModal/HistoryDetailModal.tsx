import { useState } from "react";
import { StyledSelectBox } from "../../../../common/StyledSelectBox/StyledSelectBox"
import { HistoryDetailModalStyle } from "./styled"
import { StyledButton } from "../../../../common/StyledButton/StyledButton";
import { useRecoilState } from "recoil";
import { modalState } from "../../../../../stores/modalState";
import { StyledInput } from "../../../../common/StyledInput/StyledInput";
import { History } from "../../../../../api/api";
import { postApi } from "../../../../../api/MallApi/postApi";
import Swal from "sweetalert2";

export const HistoryDetailModal = ( {orderId, returnCount, postSuccess} ) => {
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
        if(!checkInput()) {
            return;
        } else {
            const result = await postApi(History.returnSave, {
                orderId,
                count: returnCount,
                bank,
                accountNumber,
                accountHolder,
            });  
            
            if(!confirm('반품하시겠습니까?')) {
                return;
            } else {
                if (result.result === "success") {
                    Swal.fire({
                        icon: "success",
                        title: "반품 신청 완료",
                        confirmButtonText: "확인",
                    }).then(() => {
                        postSuccess(); // 승인 후 실행할 함수
                    });
                }
            }           
        }       
        
    }

    const checkInput = () => {
        if (bank=== "" || bank === null) {
            alert("은행을 선택해주세요.");
            return false;
        }

        if (accountNumber === "" || accountNumber === null) {
            alert("계좌번호를 입력해주세요.");
            return false;
        }

        if (accountHolder === "" || accountHolder === null) {
            alert("예금주를 입력해주세요.");
            return false;
        }

        return true;
    }
    
    return (
        <HistoryDetailModalStyle>
            <div className="container">
                <label>
                    은행 선택
                    <StyledSelectBox 
                        value={bank}
                        options={options}
                        onChange={setBank}
                    />
                    계좌번호
                    <StyledInput type='text' onChange={(e) => setAccountNumber(e.target.value)} placeholder="계좌번호 입력"/>
                    예금주
                    <StyledInput type='text' onChange={(e) => setAccountHolder(e.target.value)} placeholder="예금주 입력"/>
                </label>
                <div className={"button-container"}>
                    <StyledButton onClick={salesReturn}>반품</StyledButton>
                    <StyledButton onClick={() => setModal(!modal)}>취소</StyledButton>
                </div>
            </div>
            
        </HistoryDetailModalStyle>
    )
}