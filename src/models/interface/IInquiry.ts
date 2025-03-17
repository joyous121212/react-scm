export interface IInquiryList {
    inquiryId: string; // 숫자 값을 string으로 변경
    title: string;
    content: string;
    author: string;
    createdDate: string; // 날짜 문자열을 string으로 처리
    updatedDate: string | null; // null을 string 또는 null로 처리
    ansContent: string | null; // null을 string 또는 null로 처리
    ansDate: string | null; // null을 string 또는 null로 처리
    ansWriter: string | null; // null을 string 또는 null로 처리
    category: string;
    ansState: string;
}

export interface ISearcInquiryListApiResponse {
    inquiryCnt: number;
    inquiry: IInquiryList[];
}

export interface IInsertInquiryReqDTO {
    inquiryId: number | undefined;
    fileCategory: string;
    fileTitle: string;
    fileContent: string;
    // fileAnsContent  주석처리 => 가짜로 넘어오는 데이터인듯 myBtais 리턴이 모델이엿다, List<Map> 이였다하니 죽것네 fileAnsContent:
    fileInput: File | null;
    empty: string;
}

export interface IInsertInquiryResponse {
    result: "success" | "fail";
}

export interface IFileValue {
    attachmentId: "null";
    fileName: "null";
    filePath: "null";
    logicalPath: "null";
    fileSize: "null";
    fileType: "null";
    inquiryId: "null";
    category: "null";
    createdDate: "null";
}

export interface IDdetailValue {
    inquiryId: number;
    title: "null";
    content: "null";
    author: "null";
    createdDate: "null";
    updatedDate: "null";
    ansContent: "null";
    ansDate: "null";
    ansWriter: "null";
    category: "null";
    ansState: "null";
}

export interface IInquiryDetailResponse {
    detailValue: IDdetailValue;
    fileValue: IFileValue;
}
