import { UserInfoModalStyle } from "../../UserInfo/UserInfoModal/styled";

import { ManageMentWrapperButtonStyle } from "../../ManageMentStyle/ManageMentWrapperButtonStyle/ManageMentWrapperButtonStyle";
import { ManageMentStyledButton } from "../../ManageMentStyle/ManageMentStyledButton/ManageMentStyledButton";
import {
    IDdetailValue,
    IFileValue,
    IInquiryDetailResponse,
    IInsertInquiryReqDTO,
    IInsertInquiryResponse,
} from "../../../../../models/interface/IInquiry";
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
import { postInquiryFileUpdateApi } from "../../../../../api/InquiryApi/postInquiryFileUpdateApi";
import { postInquiryFileDeleteApi } from "../../../../../api/InquiryApi/postInquiryFileDeleteApi";
import { DefaultInquriySearch } from "../DefaultInquriySearch/DefaultInquriySearch";
import { PostRender } from "../../PostRender/PostRender";
import { postInquiryFileRemoveApi } from "../../../../../api/InquiryApi/postInquiryFileRemoveApi";
import { UserInfoSelectWrapperStyle } from "../../UserInfo/UserInfoSelectWrapperStyle/UserInfoSelectWrapperStyle";
const emptyCheck = {
    fileCategory: "카테고리 항목 선택은 필수 입니다.",
    fileTitle: "질문제목  입력은 필수 입니다.",
    fileContent: "질문내용  입력은 필수 입니다.",
};

interface IInquiryCUserTypeModalProps {
    inquiryId: number | undefined;
}

export const InquiryCUserTypeModal: FC<IInquiryCUserTypeModalProps> = ({ inquiryId }) => {
    const { searchKeyword, setSearchKeyword } = useContext(InquiryContext);
    const [modal, setMoal] = useRecoilState(modalState);
    const userInfo = sessionStorage.getItem("userInfo");
    const { loginId } = JSON.parse(userInfo);
    const { userType } = JSON.parse(userInfo);
    const formRef = useRef<HTMLFormElement>(null);
    const [imageUrl, setImageUrl] = useState(null);
    const [fileName, setFileName] = useState<string>("");
    const [ansState, setAnsState] = useState<string>("");
    const [ansContent, setAnsContent] = useState(null);
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
        console.log(`inquiryId===undefined  ${inquiryId === undefined}`);
        if (inquiryId === undefined) {
            console.log(`질문 삽입 모달 : ${inquiryId}`);
        } else {
            console.log(`질문 수정모달 :${inquiryId}`);
            searchDetail(inquiryId);
        }
    }, []);

    async function searchDetail(inquiryId: number) {
        const res: IInquiryDetailResponse = await searchInquiryDetailApi(InquiryInfo.inquiryDetailBody, {
            inquiryId: inquiryId,
        });
        const requestUpdateDTO: IInsertInquiryReqDTO = {
            inquiryId: inquiryId,
            fileCategory: "",
            fileTitle: "",
            fileContent: "",

            fileInput: null,
            empty: "empty",
        };
        if (res.fileValue != null) {
            setImageUrl(res?.fileValue.logicalPath);
        } else {
            setImageUrl(null);
        }
        setAnsState(res.detailValue.ansState);
        setAnsContent(res.detailValue.ansContent);
        setCreateAt(res.detailValue.createdDate);
        requestUpdateDTO.fileCategory = res.detailValue.category;
        requestUpdateDTO.inquiryId = res.detailValue.inquiryId;
        requestUpdateDTO.fileTitle = res.detailValue.title;
        requestUpdateDTO.fileContent = res.detailValue.content;
        let box = { ...detailValue };
        box = requestUpdateDTO;
        setDetailValue(box);
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

    const goInsert = async () => {
        if (!emptyCheckFnc()) {
            return;
        }

        const res: IInsertInquiryResponse = await postInquiryFileSaveApi(InquiryInfo.insertInquiry, formRef.current);

        if (res.result === "success") {
            alert("질문을 \n 등록하였습니다.");
            PostRender(DefaultInquriySearch, setSearchKeyword);
            setMoal(!modal);
        }
    };
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault(); // 폼 제출 시 페이지 새로고침 방지

        if (formRef.current) {
            const formData = new FormData(formRef.current);
        }
    };

    const createAtFnc = (date: string) => {
        const formattedDateString = date.replace(" ", "T"); // 공백을 T로 바꿔줌
        const Cdate = new Date(formattedDateString);
        // 만약 Cdate가 유효하지 않으면 에러 처리
        if (isNaN(Cdate.getTime())) {
            console.error("Invalid date format");
            return "Invalid Date";
        }
        const formattedDate = Cdate.toISOString().split("T")[0]; // YYYY-MM-DD 형식으로 변환

        return formattedDate;
    };

    const emptyCheckFnc = (): boolean => {
        // FormData 객체 생성
        const formData = new FormData(formRef.current);

        // FormData의 데이터를 emptyCheck와 같은 객체 형식으로 변환
        const formDataObj = {};
        formData.forEach((value, key) => {
            formDataObj[key] = value;
        });

        // emptyCheck 객체처럼 순회하면서 검사
        for (const key in emptyCheck) {
            if (!formDataObj[key]) {
                alert(emptyCheck[key]);
                return false; // 해당 필드가 비어있다면 메시지 출력
            }
        }

        return true;
    };

    const handler = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const { name, value } = e.target;
        setDetailValue((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handlerUpdateFile = (e: ChangeEvent<HTMLInputElement>) => {
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
    const goUpdate = async () => {
        if (!emptyCheckFnc()) {
            return;
        } // 폼 제출 시 페이지 새로고침 방지

        const formData = new FormData(formRef.current); // FormData 객체 생성
        formData.append("inquiryId", String(inquiryId)); // append로 데이터를 추가

        const res: IInsertInquiryResponse = await postInquiryFileUpdateApi(InquiryInfo.inquiryFileUpdateBody, formData);
        if (res.result === "success") {
            alert("질문 수정을 하였습니다.");
            PostRender(DefaultInquriySearch, setSearchKeyword);
            setMoal(false);
            setDetailMoal(false);
        } else {
            alert("잠시후 다시 시도해주세요");
            PostRender(DefaultInquriySearch, setSearchKeyword);
            setMoal(false);
            setDetailMoal(false);
        }
    };

    const goDelete = async () => {
        const res: IInsertInquiryResponse = await postInquiryFileDeleteApi(InquiryInfo.inquiryFileDelete, {
            inquiryId: inquiryId,
        });
        if (res.result === "success") {
            alert("질문을 삭제 하였습니다.");
            setMoal(false);
            setDetailMoal(false);
            PostRender(DefaultInquriySearch, setSearchKeyword);
        } else {
            alert("잠시후 다시 시도해주세요");
            setMoal(false);
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
                        <strong>1대1 문의</strong>
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
                                                    {loginId}
                                                </div>
                                            </td>
                                            <th scope='row'>작성일</th>
                                            <td colSpan={1}>
                                                <div className='inputTxt p100' id='inquiryCreatedDate'>
                                                    {createAtFnc(createtAt)}
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
                                        <UserInfoSelectWrapperStyle variant='primary' className='selectWrapper'>
                                            {inquiryId !== undefined ? (
                                                <>
                                                    <select
                                                        className='styledTag'
                                                        name='fileCategory'
                                                        id='fileCategory'
                                                        value={detailValue?.fileCategory}
                                                        onChange={handler}
                                                    >
                                                        <option value='' disabled>
                                                            카테고리 선택
                                                        </option>
                                                        <option value='이용문의'>이용문의</option>
                                                        <option value='구매'>구매</option>
                                                        <option value='환불/교환/반품'>환불/교환/반품</option>
                                                        <option value='제품'>제품</option>
                                                        <option value='개인정보'>개인정보</option>
                                                        <option value='기타'>기타</option>
                                                    </select>
                                                </>
                                            ) : (
                                                <>
                                                    <select
                                                        className='styledTag'
                                                        name='fileCategory'
                                                        id='fileCategory'
                                                        defaultValue={requestDTO?.fileCategory}
                                                    >
                                                        <option value='' disabled>
                                                            카테고리 선택
                                                        </option>
                                                        <option value='이용문의'>이용문의</option>
                                                        <option value='구매'>구매</option>
                                                        <option value='환불/교환/반품'>환불/교환/반품</option>
                                                        <option value='제품'>제품</option>
                                                        <option value='개인정보'>개인정보</option>
                                                        <option value='기타'>기타</option>
                                                    </select>
                                                </>
                                            )}
                                        </UserInfoSelectWrapperStyle>
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
                                                    onChange={handler}
                                                    value={detailValue.fileTitle}
                                                />
                                            </>
                                        ) : (
                                            <>
                                                <StyledInput
                                                    type='text'
                                                    className='inputTxt p100'
                                                    name='fileTitle'
                                                    id='fileTitle'
                                                />
                                            </>
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
                                                    onChange={handler}
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

                                {inquiryId != undefined && ansContent != null ? (
                                    <>
                                        <tr id='fileAns'>
                                            <th scope='row'>문의 답변</th>
                                            <td colSpan={3}>
                                                <textarea
                                                    name='fileAnsContent'
                                                    id='fileAnsContent'
                                                    cols={40}
                                                    rows={5}
                                                    readOnly
                                                    value={ansContent}
                                                />
                                            </td>
                                        </tr>
                                    </>
                                ) : (
                                    <></>
                                )}

                                {ansState === "Y" ? (
                                    <></>
                                ) : (
                                    <>
                                        <tr id='fileNo'>
                                            <th scope='row'>파일</th>

                                            <td colSpan={3}>
                                                <StyledInput
                                                    type='file'
                                                    id='fileInput'
                                                    style={{ display: "none" }}
                                                    name='file'
                                                    onChange={inquiryId != undefined ? handlerUpdateFile : handlerFile}
                                                ></StyledInput>
                                                {imageUrl != null ? (
                                                    <>
                                                        {inquiryId != undefined ? (
                                                            <>
                                                                <StyledButton type='button' onClick={deleteFile}>
                                                                    질문자 파일삭제
                                                                </StyledButton>
                                                            </>
                                                        ) : (
                                                            <></>
                                                        )}
                                                    </>
                                                ) : (
                                                    <>
                                                        <label className='img-label' htmlFor='fileInput'>
                                                            파일 첨부하기
                                                        </label>
                                                    </>
                                                )}
                                            </td>
                                        </tr>
                                    </>
                                )}
                                <tr>
                                    <th scope='row'>미리보기</th>
                                    <td colSpan={3}>
                                        {imageUrl ? (
                                            <div>
                                                <img src={imageUrl} style={{ maxWidth: "500px", maxHeight: "300px" }} />
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
                        {inquiryId != undefined && userType === "C" ? (
                            <>
                                {ansState === "Y" ? (
                                    <>
                                        {" "}
                                        <ManageMentStyledButton onClick={goDelete}>삭제</ManageMentStyledButton>
                                    </>
                                ) : (
                                    <>
                                        {" "}
                                        <ManageMentStyledButton onClick={goUpdate}>수정</ManageMentStyledButton>
                                    </>
                                )}
                            </>
                        ) : (
                            <ManageMentStyledButton onClick={goInsert}>저장</ManageMentStyledButton>
                        )}

                        <ManageMentStyledButton
                            onClick={
                                inquiryId != undefined && userType === "C"
                                    ? () => {
                                          setDetailMoal(!detailModal);
                                      }
                                    : () => {
                                          setMoal(!modal);
                                      }
                            }
                        >
                            취소
                        </ManageMentStyledButton>
                    </ManageMentWrapperButtonStyle>
                </div>
            </UserInfoModalStyle>
        </>
    );
};
