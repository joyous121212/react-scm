export interface INotice {
    noticeId: number;
    title: string;
    content: string;
    author: string;
    createdDate: string;
}

export interface INoticeDetail extends INotice {
    fileName: string | null;
    fileExt: string | null;
    fileSize: number;
    physicalPath: string | null;
    logicalPath: string | null;
}

export interface INoticeListBodyResponse {
    noticeList: INotice[];
    noticeCnt: number;
}

export interface INoticeDetailResponse {
    detailValue: INoticeDetail;
}

export interface IPostResponse {
    result: "success" | "fail";
}
