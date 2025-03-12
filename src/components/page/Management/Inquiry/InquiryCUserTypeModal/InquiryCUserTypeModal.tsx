import { UserInfoModalStyle } from "../../UserInfo/UserInfoModal/styled"
import { IInsertInquiryReqDTO, IInsertInquiryResponse } from "../../../../../models/interface/IInquiry"
import { useState ,useRef, useContext, ChangeEvent} from "react"
import { StyledButton } from "../../../../common/StyledButton/StyledButton";
import { StyledInput } from "../../../../common/StyledInput/StyledInput";
import { postInquiryFileSaveApi } from "../../../../../api/InquiryApi/postInquiryFileSaveApi";
import { InquiryInfo } from "../../../../../api/api";
import { useRecoilState } from "recoil";
import { modalState } from "../../../../../stores/modalState";
import { InquiryContext } from "../../../../../api/Provider/Inquiry/InquiryProvider";

export const InquiryCUserTypeModal=()=>{
    const { searchKeyword, setSearchKeyword } = useContext(InquiryContext);
    const [modal,setMoal]=useRecoilState(modalState);
    const userInfo= sessionStorage.getItem('userInfo');
    const {loginId} = JSON.parse(userInfo);
    const formRef=useRef<HTMLFormElement>(null);
    const [imageUrl, setImageUrl] = useState<string>("");
    const [fileName, setFileName] = useState<string>("");
    const requestDTO:IInsertInquiryReqDTO={
        inquiryId:null,
        fileCategory: "",
        fileTitle: "",
        fileContent: "",
        // fileAnsContent  주석처리 => 가짜로 넘어오는 데이터인듯 myBtais 리턴이 모델이엿다, List<Map> 이였다하니 죽것네 fileAnsContent: 
        fileInput:null,
        empty: "empty",
    }

     const handlerFile = (e: ChangeEvent<HTMLInputElement>) => {
            const fileInfo = e.target.files;
            if (fileInfo?.length > 0) {
                const fileSplit = fileInfo[0].name.split(".");
                const fileExt = fileSplit[1].toLowerCase();
    
                if (fileExt === "jpg" || fileExt === "gif" || fileExt === "png") {
                    setImageUrl(URL.createObjectURL(fileInfo[0]));
                }
                setFileName(fileInfo[0].name);
            }
        };

    const goInsert= async ()=>{

      const res:IInsertInquiryResponse=  await postInquiryFileSaveApi(InquiryInfo.insertInquiry,formRef.current);
        console.log(res)
      if(res.result==="success"){
        alert("질문을 등록하였습니다.");
        setMoal(!modal);
        setSearchKeyword({ searchTitle: "",
            searchStDate: "",
            searchEdDate: "",
            currentPage: 1,
            pageSize: 5,
            userType: null,})
      }
   
    }    
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();  // 폼 제출 시 페이지 새로고침 방지
    
        if (formRef.current) {
          const formData = new FormData(formRef.current);  // FormData 객체를 생성
    
          // key-value 값을 로그로 찍기
          formData.forEach((value, key) => {
            console.log(`${key}: ${value}`);
          });
        }
      };

const TodayFnc=()=>{

    const today = new Date();
    const year = today.getFullYear();  // 년도
    const month = (today.getMonth() + 1).toString().padStart(2, '0'); // 월 (0부터 시작하므로 1을 더해줍니다.)
    const day = today.getDate().toString().padStart(2, '0');  // 일
  
    const formattedDate = `${year}-${month}-${day}`;

    return formattedDate;
}
    return (<>
    <UserInfoModalStyle>
    <div className='container'>
    <form ref={formRef}>
    <table className="row">
      <caption>caption</caption>
      <colgroup>
        <col width="120px" />
        <col width="150px" />
        <col width="120px" />
        <col width="150px" />
      </colgroup>

      <tbody>
        <tr id="inquiryAuthorTr">
          <th scope="row">작성자</th>
          <td colSpan={1}>
            <div className="inputTxt p100" id="inquiryAuthor">
              {loginId}
            </div>
          </td>
          <th scope="row">작성일</th>
          <td colSpan={1}>
            <div className="inputTxt p100" id="inquiryCreatedDate">
              {TodayFnc()}
            </div>
          </td>
        </tr>
        <tr>
          <th scope="row">
            카테고리 <span className="font_red">*</span>
          </th>
          <td colSpan={3}>
            <select
              className="inputTxt p100"
              name="fileCategory"
              id="fileCategory"
             defaultValue={requestDTO?.fileCategory}
            >
              <option value="" disabled>
                카테고리 선택
              </option>
              <option value="이용문의">이용문의</option>
              <option value="구매">구매</option>
              <option value="환불/교환/반품">환불/교환/반품</option>
              <option value="제품">제품</option>
              <option value="개인정보">개인정보</option>
              <option value="기타">기타</option>
            </select>
          </td>
        </tr>
        <tr>
          <th scope="row">
            제목 <span className="font_red">*</span>
          </th>
          <td colSpan={3}>
            <input
              type="text"
              className="inputTxt p100"
              name="fileTitle"
              id="fileTitle"
             
            />
          </td>
        </tr>
        <tr>
          <th scope="row">
            내용 <span className="font_red">*</span>
          </th>
          <td colSpan={3}>
            <textarea
              name="fileContent"
              id="fileContent"
              cols={40}
              rows={5}             
            />
          </td>
        </tr>
        <tr id="fileAns">
          <th scope="row">문의 답변</th>
          <td colSpan={3}>
            <textarea
              name="fileAnsContent"
              id="fileAnsContent"
               cols={40}
              rows={5}
              
            />
          </td>
        </tr>
        <tr id="fileNo">
          <th scope="row">파일</th>
          <td colSpan={3}>
        
                               <StyledInput
                                   type='file'
                                   id='fileInput'
                                   style={{ display: "none" }}
                                   name='file'
                                   onChange={handlerFile}
                               ></StyledInput>
                                <label className='img-label' htmlFor='fileInput'>
                        파일 첨부하기
                    </label>
          </td>
        </tr>
        {/* {fileName && (
          <tr id="fileYes">
            <th scope="row">파일</th>
            <td colSpan={3}>
              <input
                type="text"
                className="inputTxt p100"
                name="fileName"
                id="fileName"
                value={fileName}
                disabled
              />
            </td>
            <td colSpan={1}>
              <a
                href="#"
                className="btnType blue"
                id="btnRemoveFile"
                onClick={handleRemoveFile}
              >
                <span>파일삭제</span>
              </a>
            </td>
          </tr>
        )} */}
        <tr>
          <th scope="row">미리보기</th>
          {imageUrl ? (
                            <div>
                                
                                <img src={imageUrl} />
                                {fileName}
                            </div>
                        ) : (
                            <div>{fileName}</div>
                        )}
        </tr>
      </tbody>
    </table>
    </form>
    <div className='btn_areaC mt30'>

        <StyledButton onClick={goInsert}>저장</StyledButton>
    </div>
    </div>
            <button onClick={handleSubmit}>데이터테스트</button>
    </UserInfoModalStyle>
    
    </>)
}