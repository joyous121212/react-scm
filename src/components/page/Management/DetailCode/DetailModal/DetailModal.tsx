import { FC, useContext, useEffect, useState } from "react";
import { StyledInput } from "../../../../common/StyledInput/StyledInput";
import { useRecoilState } from "recoil";
import { modalState } from "../../../../../stores/modalState";
import { searchApi } from "../../../../../api/CommonCodeApi/searchApi";
import { CommonCode, DetailCode } from "../../../../../api/api";
import { postApi } from "../../../../../api/CommonCodeApi/postApi";
import { ICommonDetailCode } from "../../../../../models/interface/ICommonCode";
import { nullCheck, TypeNullCheck } from "../../../../../common/nullCheck";
import { DetailCodeModalStyled } from "./styled";
import { CommonDetailCodeContext } from "../../../../../api/Provider/CommonDetailCodeProvider";

interface ICommonCodeModalProps {
    detailCodeId: number;
    postSuccess: () => void;
    setDetailCodeId: React.Dispatch<React.SetStateAction<number>>;
}

const initDetailCode = {
    groupCode: "",
    detailIdx: 0,
    detailCode: "",
    detailName: "",
    useYn: "N",
    createdDate: "",
    author: "",
    note: "",
};

export const DetailCodeModal: FC<ICommonCodeModalProps> = ({ detailCodeId, postSuccess, setDetailCodeId }) => {
    const [modal, setModal] = useRecoilState(modalState);
    const [detailCode, setDetailCode] = useState<ICommonDetailCode>(initDetailCode);
    const { groupCode } = useContext(CommonDetailCodeContext);

    useEffect(() => {
        detailCodeId && detailCodeDetail();

        return () => {
            setDetailCodeId(0);
        };
    }, []);

    const detailCodeDetail = async () => {
        const result = await searchApi<{ detailValue: ICommonDetailCode }>(DetailCode.searchDetail, {
            detailIdx: detailCodeId,
        });

        if (result) {
            setDetailCode(result.detailValue);
        }
    };

    const updateDetailCode = async () => {
        const checkList: TypeNullCheck[] = [
            { inval: detailCode.detailCode, msg: `상세코드의 값이 없습니다.` },
            { inval: detailCode.detailName, msg: `상세코드명의 값이 없습니다.` },
            { inval: detailCode.note, msg: `상세코드설명의 값이 없습니다.` },
        ];

        const isValid = nullCheck(checkList);
        if (isValid) {
            const result = await postApi(DetailCode.update, {
                ...detailCode,
                detailNote: detailCode.note, // ✅ note -> detailNote 변경
            });

            if (result.result === "success") {
                alert("수정되었습니다.");
                postSuccess();
            } else if (result.result.startsWith("Duplicate")) {
                alert(`입력하신 상세코드(${detailCode.detailCode})는 중복입니다.`);
                return false;
            }
        } else {
            console.log("값이 올바르지 않습니다.");
            return;
        }
    };

    const insertDetailCode = async () => {
        const checkList: TypeNullCheck[] = [
            { inval: detailCode.detailCode, msg: `상세코드의 값이 없습니다.` },
            { inval: detailCode.detailName, msg: `상세코드명의 값이 없습니다.` },
            { inval: detailCode.note, msg: `상세코드설명의 값이 없습니다.` },
        ];
        const isValid = nullCheck(checkList);
        if (isValid) {
            const result = await postApi(DetailCode.save, {
                ...detailCode,
                detailNote: detailCode.note,
                groupCode:groupCode // ✅ note -> detailNote 변경
            });

            if (result.result === "success") {
                alert("저장되었습니다.");
                postSuccess();
            } else if (result.result.startsWith("Duplicate")) {
                alert(`입력하신 상세코드(${detailCode.detailCode})는 중복입니다.`);
                return false;
            }
        } else {
            console.log("값이 올바르지 않습니다.");
            return;
        }
    };

    const deleteDetailCode = async () => {
        const result = await postApi(DetailCode.delete, { detailIdx: detailCodeId });
        console.log(result);

        if (result.result === "success") {
            alert("삭제되었습니다.");
            postSuccess();
        }
    };
    return (
        <DetailCodeModalStyled>
            <div className='container'>
                <dt>
                    <strong>상세코드관리</strong>
                </dt>
                <table>
                    <tbody>
                        <tr>
                            <th>
                                그룹코드<span className='font_red'>*</span>
                            </th>
                            <td>
                                <StyledInput type='text' value={groupCode} readOnly></StyledInput>
                            </td>
                        </tr>
                        <tr>
                            <th>
                                상세코드<span className='font_red'>*</span>
                            </th>
                            <td>
                                <StyledInput
                                    type='text'
                                    value={detailCode.detailCode}
                                    onChange={(e) => setDetailCode((prev) => ({ ...prev, detailCode: e.target.value }))}
                                ></StyledInput>
                            </td>
                        </tr>
                        <tr>
                            <th>
                                상세코드명<span className='font_red'>*</span>
                            </th>
                            <td>
                                <StyledInput
                                    type='text'
                                    value={detailCode.detailName}
                                    onChange={(e) => setDetailCode((prev) => ({ ...prev, detailName: e.target.value }))}
                                ></StyledInput>
                            </td>
                        </tr>
                        <tr>
                            <th>
                                상세코드설명<span className='font_red'>*</span>
                            </th>
                            <td>
                                <StyledInput
                                    type='text'
                                    value={detailCode.note}
                                    onChange={(e) => setDetailCode((prev) => ({ ...prev, note: e.target.value }))}
                                ></StyledInput>
                            </td>
                        </tr>
                        <tr>
                            <th>사용여부</th>
                            <td>
                                <div className='radio-group'>
                                    <label>Yes</label>
                                    <StyledInput
                                        type='radio'
                                        name='useYn'
                                        value={"Y"}
                                        checked={detailCode.useYn === "Y"}
                                        onChange={(e) => setDetailCode((prev) => ({ ...prev, useYn: e.target.value }))}
                                    />

                                    <label>No</label>
                                    <StyledInput
                                        type='radio'
                                        name='useYn'
                                        value={"N"}
                                        checked={detailCode.useYn === "N"}
                                        onChange={(e) => setDetailCode((prev) => ({ ...prev, useYn: e.target.value }))}
                                    />
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <div className='button-container'>
                    <button type='button' onClick={detailCodeId ? updateDetailCode : insertDetailCode}>
                        {detailCodeId ? "수정" : "저장"}
                    </button>
                    {!!detailCodeId && (
                        <button type='button' onClick={deleteDetailCode}>
                            삭제
                        </button>
                    )}
                    <button type='button' onClick={() => setModal(!modal)}>
                        나가기
                    </button>
                </div>
            </div>
        </DetailCodeModalStyled>
    );
};
