import { CommonCodeMainStyled } from "../../CommonCode/CommonCodeMain/styled";
import { useContext ,useEffect, useState} from "react";
import { SupplierInfoContext } from "../../../../../api/Provider/SupplierInfoProvider";
import axios from "axios";
import { Column } from "../../../../common/StyledTable/StyledTable";
import { StyledTable } from "../../../../common/StyledTable/StyledTable";
import { StyledButton } from "../../../../common/StyledButton/StyledButton";
import { SupplierInfoModal } from "../SupplierInfoModal/SupplierInfoModal";
import { Portal } from "../../../../common/potal/Portal";
import { useRecoilState } from "recoil";
import { detailModalState } from "../../../../../stores/modalState";
export const SupplierInfoMain=()=>{
const {searchKeyword, setSearchKeyword}= useContext(SupplierInfoContext);
const [supplierList,setSupplierList]=useState([]);
const [supplierCnt,setSupplierCnt]=useState(0);
const [supplyId,setSupplyId]=useState(undefined)
//
const [detailModal, setDetailModal] = useRecoilState(detailModalState);
const columns = [
  { key: "name", title: "납품업체명" },
  { key: "manager", title: "담당자명" },
  { key: "phone", title: "담당자연락처" },
  { key: "address", title: "주소" },
  { key: "tradeState", title: "거래상태" },
  { key: "actions", title: "비고" },

] as Column<any>[];
useEffect(()=>{
     async function searChCall(){
       const res=  await axios.post("/management/supplierListBody.do",searchKeyword);
     //  console.log(res.data)
       setSupplierList(res.data.supplier);
       setSupplierCnt(res.data.supplierCnt);
     } 
     searChCall();
},[searchKeyword])

useEffect(()=>{
  console.log(supplierList)
})






    return (<>
    { supplierList!=null? (<>
    <CommonCodeMainStyled>
      <StyledTable      
      data={supplierList}
      columns={columns} 
      

      //백단으로 오직 한개의 supplyId 을 넘겨야 한다.  supplyDetail(${list.supplyId});
      renderAction={(row) => (
                                      <StyledButton
                                          size='small'
                                          onClick={async () => {
                                              console.log(row);
                                              setSupplyId(row.supplyId);
                                              setDetailModal(!detailModal);                                              
                                          }}
                                          
                                      >
                                          수정
                                      </StyledButton>
                                  )}




     />
     </CommonCodeMainStyled>
    </>):(<></>)

    }
    
 {detailModal  && (
               
                <Portal>
                    <SupplierInfoModal supplyId={supplyId} detailModal={detailModal} />
                </Portal>
            )}


    </>)
}