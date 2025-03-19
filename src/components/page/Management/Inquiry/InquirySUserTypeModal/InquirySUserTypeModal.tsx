import { UserInfoModalStyle } from "../../UserInfo/UserInfoModal/styled";
import {
    IDdetailValue,
    IFileValue,
    IInquiryDetailResponse,
    IInsertInquiryReqDTO,
    IInsertInquiryResponse,
} from "../../../../../models/interface/IInquiry";
import { ManageMentWrapperButtonStyle } from "../../ManageMentStyle/ManageMentWrapperButtonStyle/ManageMentWrapperButtonStyle";
import { ManageMentStyledButton } from "../../ManageMentStyle/ManageMentStyledButton/ManageMentStyledButton";
import { useState, useRef, useContext, ChangeEvent, useEffect } from "react";
import { StyledButton } from "../../../../common/StyledButton/StyledButton";
import { StyledInput } from "../../../../common/StyledInput/StyledInput";
import { postInquiryFileSaveApi } from "../../../../../api/InquiryApi/postInquiryFileSaveApi";
import { InquiryInfo } from "../../../../../api/api";
import { useRecoilState } from "recoil";
import { detailModalState, modalState } from "../../../../../stores/modalState";
import { InquiryContext } from "../../../../../api/Provider/Inquiry/InquiryProvider";
import { FC } from "react";
import { searchInquiryDetailApi } from "../../../../../api/InquiryApi/searchInquiryDetailApi";
import { postInquiryAnsSaveApi } from "../../../../../api/InquiryApi/postInquiryAnsSaveApi";
import { DefaultInquriySearch } from "../DefaultInquriySearch/DefaultInquriySearch";
import { PostRender } from "../../PostRender/PostRender";
import { postInquiryFileDeleteApi } from "../../../../../api/InquiryApi/postInquiryFileDeleteApi";
import { postInquiryFileRemoveApi } from "../../../../../api/InquiryApi/postInquiryFileRemoveApi";
const emptyCheck = {
    fileCategory: "카테고리 항목 선택은 필수 입니다.",
    fileTitle: "질문제목  입력은 필수 입니다.",
    fileContent: "질문내용  입력은 필수 입니다.",
};

interface IInquiryCUserTypeModalProps {
    inquiryId: number | undefined;
}
// 파일이 없을시 답변등록 파라미터
// inquiryId: 36
// fileAnsContent: sdfdsf

export const InquirySUserTypeModal: FC<IInquiryCUserTypeModalProps> = ({ inquiryId }) => {
    const { searchKeyword, setSearchKeyword } = useContext(InquiryContext);

    const userInfo = sessionStorage.getItem("userInfo");

    const formRef = useRef<HTMLFormElement>(null);
    const [imageUrl, setImageUrl] = useState<string>("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [fileName, setFileName] = useState<string>("");
    const [ansContent, setAnsContent] = useState(null);
    const authoRef = useRef<String>();
    const createdDateRef = useRef<String>();
    //이12","author":"biz01","createdDate":"2

    const [detailValue, setDetailValue] = useState<IInsertInquiryReqDTO>({
        inquiryId: null,
        fileCategory: "",
        fileTitle: "",
        fileContent: "",
        // fileAnsContent  주석처리 => 가짜로 넘어오는 데이터인듯 myBtais 리턴이 모델이엿다, List<Map> 이였다하니 죽것네 fileAnsContent:
        fileInput: null,
        empty: "empty",
    });
    const [fileValue, setFileValue] = useState<IFileValue>();
    const [detailModal, setDetailMoal] = useRecoilState(detailModalState);
    const [createtAt, setCreateAt] = useState("");
    const requestDTO: IInsertInquiryReqDTO = {
        inquiryId: null,
        fileCategory: "",
        fileTitle: "",
        fileContent: "",
        // fileAnsContent  주석처리 => 가짜로 넘어오는 데이터인듯 myBtais 리턴이 모델이엿다, List<Map> 이였다하니 죽것네 fileAnsContent:
        fileInput: null,
        empty: "empty",
    };

    useEffect(() => {
        searchDetail(inquiryId);
    }, []);
    useEffect(() => {}, [ansContent]);

    async function searchDetail(inquiryId: number) {
        const res: IInquiryDetailResponse = await searchInquiryDetailApi(InquiryInfo.inquiryDetailBody, {
            inquiryId: inquiryId,
        });
        const requestUpdateDTO: IInsertInquiryReqDTO = {
            inquiryId: inquiryId,
            fileCategory: "",
            fileTitle: "",
            fileContent: "",
            // fileAnsContent  주석처리 => 가짜로 넘어오는 데이터인듯 myBtais 리턴이 모델이엿다, List<Map> 이였다하니 죽것네 fileAnsContent:
            fileInput: null,
            empty: "empty",
        };

        if (res.fileValue != null) {
            setImageUrl(res?.fileValue.logicalPath);
        } else {
            setImageUrl(null);
        }

        authoRef.current = res.detailValue.author;
        createdDateRef.current = res.detailValue.createdDate;
        setAnsContent(res.detailValue.ansContent);
        setCreateAt(res.detailValue.createdDate);
        requestUpdateDTO.fileCategory = res.detailValue.category;
        requestUpdateDTO.inquiryId = res.detailValue.inquiryId;
        requestUpdateDTO.fileTitle = res.detailValue.title;
        requestUpdateDTO.fileContent = res.detailValue.content;
        let box = { ...detailValue };
        box = requestUpdateDTO;
        setDetailValue(box);
        // setFileValue();
    }

    const goInquiryInsert = async () => {
        const formData = new FormData(formRef.current);
        formData.append("inquiryId", inquiryId.toString());

        var check = true;
        if (formRef.current) {
            formData.forEach((value, key) => {
                if (key === "fileAnsContent" && value === "") {
                    check = false;
                }
            });
        }

        if (!check) {
            alert("답글 작성을 부탁드립니다.");
            return;
        }

        const res: IInsertInquiryResponse = await postInquiryAnsSaveApi(InquiryInfo.inquiryAnsSaveBody, formData);
        if (res.result === "success") {
            alert("답변 작성을 하였습니다.");
            PostRender(DefaultInquriySearch, setSearchKeyword);

            setDetailMoal(false);
        } else {
            alert("잠시후 다시 시도해주세요");
            PostRender(DefaultInquriySearch, setSearchKeyword);

            setDetailMoal(false);
        }
    };
    const goDelete = async () => {
        const res: IInsertInquiryResponse = await postInquiryFileDeleteApi(InquiryInfo.inquiryFileDelete, {
            inquiryId: inquiryId,
        });
        if (res.result === "success") {
            alert("질문을 삭제 하였습니다.");

            setDetailMoal(false);
            PostRender(DefaultInquriySearch, setSearchKeyword);
        } else {
            alert("잠시후 다시 시도해주세요");

            setDetailMoal(false);
            PostRender(DefaultInquriySearch, setSearchKeyword);
        }
    };

    //질문자가 등록한 사진 파일만 삭제
    const deleteFile = async () => {
        const res: IInsertInquiryResponse = await postInquiryFileRemoveApi(InquiryInfo.inquiryFileRemove, {
            inquiryId: inquiryId,
        });
        if (res.result === "success") {
            alert("질문자의 등록 파일만을 삭제하였습니다.");
            PostRender(DefaultInquriySearch, setSearchKeyword);
            setDetailMoal(false);
        } else {
            alert("잠시후 다시 시도해주세요");
            PostRender(DefaultInquriySearch, setSearchKeyword);
            setDetailMoal(false);
        }
    };

    return (
        <>
            <UserInfoModalStyle>
                <div className='container'>
                    <dt>
                        <strong>고객 문의 답변</strong>
                    </dt>
                    <form ref={formRef}>
                        <table className='row'>
                            <colgroup>
                                <col width='120px' />
                                <col width='150px' />
                                <col width='120px' />
                                <col width='150px' />
                            </colgroup>

                            <tbody>
                                {inquiryId !== undefined ? (
                                    <>
                                        <tr id='inquiryAuthorTr'>
                                            <th scope='row'>작성자</th>
                                            <td colSpan={1}>
                                                <div className='inputTxt p100' id='inquiryAuthor'>
                                                    {authoRef.current}
                                                </div>
                                            </td>
                                            <th scope='row'>작성일</th>
                                            <td colSpan={1}>
                                                <div className='inputTxt p100' id='inquiryCreatedDate'>
                                                    {createdDateRef.current}
                                                </div>
                                            </td>
                                        </tr>
                                    </>
                                ) : (
                                    <></>
                                )}

                                <tr>
                                    <th scope='row'>
                                        카테고리 <span className='font_red'>*</span>
                                    </th>
                                    <td colSpan={3}>
                                        {inquiryId !== undefined ? (
                                            <>
                                                <StyledInput
                                                    type='text'
                                                    className='inputTxt p100'
                                                    name='fileTitle'
                                                    id='fileTitle'
                                                    value={detailValue?.fileCategory}
                                                    readOnly
                                                />
                                            </>
                                        ) : (
                                            <></>
                                        )}
                                    </td>
                                </tr>
                                <tr>
                                    <th scope='row'>
                                        제목 <span className='font_red'>*</span>
                                    </th>
                                    <td colSpan={3}>
                                        {inquiryId != undefined ? (
                                            <>
                                                <StyledInput
                                                    type='text'
                                                    className='inputTxt p100'
                                                    name='fileTitle'
                                                    id='fileTitle'
                                                    readOnly
                                                    value={detailValue.fileTitle}
                                                />
                                            </>
                                        ) : (
                                            <></>
                                        )}
                                    </td>
                                </tr>
                                <tr>
                                    <th scope='row'>
                                        내용 <span className='font_red'>*</span>
                                    </th>
                                    <td colSpan={3}>
                                        {inquiryId != undefined ? (
                                            <>
                                                <StyledInput
                                                    name='fileContent'
                                                    id='fileContent'
                                                    readOnly
                                                    value={detailValue.fileContent}
                                                />
                                            </>
                                        ) : (
                                            <>
                                                <textarea name='fileContent' id='fileContent' cols={40} rows={5} />
                                            </>
                                        )}
                                    </td>
                                </tr>

                                <tr id='fileAns'>
                                    <th scope='row'>문의 답변</th>
                                    <td colSpan={3}>
                                        <textarea
                                            name='fileAnsContent'
                                            id='fileAnsContent'
                                            cols={40}
                                            rows={5}
                                            defaultValue={ansContent}
                                        />
                                    </td>
                                </tr>

                                <tr id='fileNo'>
                                    <th scope='row'>파일</th>
                                    <td colSpan={3}>
                                        <StyledInput
                                            type='file'
                                            id='fileInput'
                                            style={{ display: "none" }}
                                            name='file'
                                            readOnly
                                            // onChange={inquiryId != undefined ? handlerUpdateFile : handlerFile}
                                        ></StyledInput>
                                        {imageUrl != null ? (
                                            <>
                                                <StyledButton onClick={deleteFile}>질문자 파일삭제</StyledButton>
                                            </>
                                        ) : (
                                            <>
                                                <span>질문자의 사진이 없습니다</span>
                                            </>
                                        )}
                                    </td>
                                </tr>
                                <tr>
                                    <th scope='row'>미리보기</th>
                                    <td colSpan={3}>
                                        {imageUrl ? (
                                            <div>
                                                <img src={imageUrl} style={{ maxWidth: "600px", maxHeight: "700px" }} />
                                                {fileName}
                                            </div>
                                        ) : (
                                            <div>{fileName}</div>
                                        )}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </form>

                    <ManageMentWrapperButtonStyle>
                        <ManageMentStyledButton onClick={goInquiryInsert}>답변등록</ManageMentStyledButton>
                        <ManageMentStyledButton onClick={goDelete}>질문 삭제</ManageMentStyledButton>
                        <ManageMentStyledButton
                            onClick={() => {
                                setDetailMoal(!detailModal);
                            }}
                        >
                            취소
                        </ManageMentStyledButton>
                    </ManageMentWrapperButtonStyle>
                </div>
            </UserInfoModalStyle>
        </>
    );
};
