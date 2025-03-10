import { CommonCodeMainStyled } from "../../CommonCode/CommonCodeMain/styled";
import { useContext ,useEffect, useState} from "react";
import { SupplierInfoContext } from "../../../../../api/Provider/SupplierInfoProvider";

import { Column } from "../../../../common/StyledTable/StyledTable";
import { StyledTable } from "../../../../common/StyledTable/StyledTable";
import { StyledButton } from "../../../../common/StyledButton/StyledButton";
import { SupplierInfoModal } from "../SupplierInfoModal/SupplierInfoModal";
import { Portal } from "../../../../common/potal/Portal";
import { useRecoilState } from "recoil";
import { detailModalState } from "../../../../../stores/modalState";
import { PageNavigate } from "../../../../common/pageNavigation/PageNavigate";
import { SupplierInfo } from "../../../../../api/api";
import { searchSupplierListApi } from "../../../../../api/SupplierInfoApi/searchSupplierListApi";
import { detailListModalState } from "../../../../../stores/modalState";

import { useNavigate } from "react-router-dom";


export const SupplierInfoMain=()=>{

   const  [detailListModal,setDetailListModal]=useRecoilState(detailListModalState)
  
const {searchKeyword, setSearchKeyword}= useContext(SupplierInfoContext);
const [supplierList,setSupplierList]=useState([]);
const [supplierCnt,setSupplierCnt]=useState(0);
const [supplyId,setSupplyId]=useState(undefined);
const [detailModal, setDetailModal] = useRecoilState(detailModalState);
const [cPage, setCPage] = useState<number>(0);
//
const [supCount, setSupCoun] = useState<number>(0);

const suppDetailInfoSearchApi = async (currentPage?: number) => {
  currentPage = currentPage || 1;
  const box = { ...searchKeyword };
  box.currentPage = currentPage;
  setSearchKeyword(box);
};
const navigate = useNavigate();
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
       const res:any=   await searchSupplierListApi(SupplierInfo.searchSupplierList,searchKeyword);
       console.log(res)
       setSupplierList(res.supplier);
       setSupplierCnt(res.supplierCnt);
     } 
     searChCall();
},[searchKeyword])

useEffect(()=>{
  console.log(supplierList)
})


const goNewPage=(supplyId:string)=>{

  setDetailListModal(!detailListModal);

}



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


                                  onCellClick={(row, column) => {
                                    goNewPage(row.supplyId)
                                    navigate(`${row.supplyId}`, { state: { groupCode: row.groupCode } })
                
                                   
                                }}




     />
        </CommonCodeMainStyled>
<>
   <PageNavigate
                totalItemsCount={supplierCnt}
                onChange={suppDetailInfoSearchApi}
                itemsCountPerPage={5}
                activePage={cPage}
            /> 
</>



    </>):(<></>)

    }
    
 {detailModal  && (
               
                <Portal>
                    <SupplierInfoModal supplyId={supplyId} detailModal={detailModal} />
                </Portal>
            )}


    </>)
}