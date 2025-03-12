

import { InquiryInfo } from "../../../../../api/api";
import { searcinquiryListApi } from "../../../../../api/InquiryApi/searcinquiryListApi";
import { InquiryContext } from "../../../../../api/Provider/Inquiry/InquiryProvider";
import { useContext ,useEffect, useState} from "react";

import { CommonCodeMainStyled } from "../../CommonCode/CommonCodeMain/styled";
import { Column } from "../../../../common/StyledTable/StyledTable";
import { StyledTable } from "../../../../common/StyledTable/StyledTable";
import { IInquiryCnt, IInquiryList } from "../../../../../models/interface/IInquiry";
import { ISearcInquiryListApiResponse } from "../../../../../models/interface/IInquiry";
import { useRecoilState } from "recoil";
import { modalState } from "../../../../../stores/modalState";
import { Portal } from "../../../../common/potal/Portal";
import { InquiryCUserTypeModal } from "../InquiryCUserTypeModal/InquiryCUserTypeModal";
export const InquiryMain=()=>{
    const userInfo= sessionStorage.getItem('userInfo');
    const {userType} = JSON.parse(userInfo);
    const [modal,setMoal]=useRecoilState(modalState)

    const columns = [
        { key: "inquiryId", title: "문의번호" },
        { key: "category", title: "카테고리" },
        { key: "title", title: "문의제목" },
        { key: "createdDate", title: "문의날짜" },
        { key: "ansState", title: "답변상태" },
        { key: "author", title: "작성자 아이디" },
    ] as Column<any>[];

      const { searchKeyword, setSearchKeyword } = useContext(InquiryContext);
      const [inquiry,setInquiry]=useState<IInquiryList[]>();
      const [inquiryCnt,setInquiryCnt]=useState<IInquiryCnt>();

    async function searchFnc(){
        console.log(searchKeyword)
    
    
        const res:ISearcInquiryListApiResponse =    await  searcinquiryListApi(InquiryInfo.inquiryListBody,searchKeyword)
        
        setInquiry(res.inquiry);
        setInquiryCnt(res.inquiryCnt)
    
    }

      useEffect(()=>{

        searchFnc();


      },[searchKeyword])

    return (<>
        <CommonCodeMainStyled>
<StyledTable data={inquiry} columns={columns}/>

        </CommonCodeMainStyled>
        {modal&& userType==="C" &&(
              <Portal>
<InquiryCUserTypeModal/>

              </Portal>
        )}
      
    </>)
}