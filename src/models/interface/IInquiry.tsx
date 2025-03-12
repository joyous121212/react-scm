

export interface IInquiryList {
    inquiryId: string;      // 숫자 값을 string으로 변경
    title: string;
    content: string;
    author: string;
    createdDate: string;    // 날짜 문자열을 string으로 처리
    updatedDate: string | null;  // null을 string 또는 null로 처리
    ansContent: string | null;  // null을 string 또는 null로 처리
    ansDate: string | null;     // null을 string 또는 null로 처리
    ansWriter: string | null;   // null을 string 또는 null로 처리
    category: string;
    ansState: string;
  }
  export interface IInquiryCnt{
    inquiryCnt:number
  }

  export interface ISearcInquiryListApiResponse {
    inquiryCnt:IInquiryCnt;
    inquiry:IInquiryList[];
  }

  export interface IInsertInquiryReqDTO{
    inquiryId:null;
    fileCategory: string;
    fileTitle: string;
    fileContent: string;
    // fileAnsContent  주석처리 => 가짜로 넘어오는 데이터인듯 myBtais 리턴이 모델이엿다, List<Map> 이였다하니 죽것네 fileAnsContent: 
    fileInput: File|null;
    empty: string;
  }

  export interface IInsertInquiryResponse{

    
      result:"success"|"fail"
    

  }