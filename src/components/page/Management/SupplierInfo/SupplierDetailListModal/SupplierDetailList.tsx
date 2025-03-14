
import { useRecoilState } from "recoil";
import { detailListModalState } from "../../../../../stores/modalState";

export const SupplierDetailListModal=()=>{

    const  [detailListModal,setDetailListModal]=useRecoilState(detailListModalState)

    return(<></>);
}