import { FC, useEffect, useState } from "react";
import { StyledInput } from "../../../../common/StyledInput/StyledInput";
import { CommonCodeModalStyle } from "./styled";
import { useRecoilState } from "recoil";
import { modalState } from "../../../../../stores/modalState";
import { searchApi } from "../../../../../api/CommonCodeApi/searchApi";
import { CommonCode } from "../../../../../api/api";
import { postApi } from "../../../../../api/CommonCodeApi/postApi";
import { ICommonCode } from "../../../../../models/interface/ICommonCode";

interface ICommonCodeModalProps {
    groupId: number;
    postSuccess: () => void;
    setGroupId: React.Dispatch<React.SetStateAction<number>>;
}

const initCommonCode = {
    groupIdx: 0,
    groupCode: "",
    groupName: "",
    useYn: "N",
    createdDate: "",
    author: "",
    note: "",
};

export const CommonCodeModal: FC<ICommonCodeModalProps> = ({ groupId, postSuccess, setGroupId }) => {
    const [modal, setModal] = useRecoilState(modalState);
    const [commonCode, setCommonCode] = useState<ICommonCode>(initCommonCode);

    useEffect(() => {
        groupId && commonCodeDetail();

        return () => {
            setGroupId(0);
        };
    }, []);

    const commonCodeDetail = async () => {
        const result = await searchApi<{ detailValue: ICommonCode }>(CommonCode.searchDetail, { groupIdx: groupId });

        if (result) {
            setCommonCode(result.detailValue);
        }
    };

    const updateCommonCode = async () => {
        const result = await postApi(CommonCode.update, commonCode);

        if (result.result === "success") {
            alert("수정되었습니다.");
            postSuccess();
        } else if (result.result.startsWith("Duplicate")) {
            alert(`입력하신 그룹코드(${commonCode.groupCode})는 중복입니다.`);
            return false;
        }
    };

    const insertCommonCode = async () => {
        const result = await postApi(CommonCode.save, commonCode);

        if (result.result === "success") {
            alert("저장되었습니다.");
            postSuccess();
        } else if (result.result.startsWith("Duplicate")) {
            alert(`입력하신 그룹코드(${commonCode.groupCode})는 중복입니다.`);
            return false;
        }
    };

    const deleteCommonCode = async () => {
        const result = await postApi(CommonCode.delete, { groupIdx: groupId });

        if (result.result === "success") {
            alert("삭제되었습니다.");
            postSuccess();
        }
    };
    return (
        <CommonCodeModalStyle>
            <div className='container'>
                <label>
                    그룹코드*
                    <StyledInput
                        type='text'
                        defaultValue={commonCode.groupCode}
                        onChange={(e) => setCommonCode((prev) => ({ ...prev, groupCode: e.target.value }))}
                    ></StyledInput>
                </label>
                <label>
                    그룹코드명*
                    <StyledInput
                        type='text'
                        defaultValue={commonCode.groupName}
                        onChange={(e) => setCommonCode((prev) => ({ ...prev, groupName: e.target.value }))}
                    ></StyledInput>
                </label>
                <label>
                    그룹코드설명*
                    <StyledInput
                        type='text'
                        defaultValue={commonCode.note}
                        onChange={(e) => setCommonCode((prev) => ({ ...prev, note: e.target.value }))}
                    ></StyledInput>
                </label>
                <label>
                    사용여부*
                    <div className='radio-group'>
                        <label>Yes</label>
                        <StyledInput
                            type='radio'
                            name='useYn'
                            value={"Y"}
                            checked={commonCode.useYn === "Y"}
                            onChange={(e) => setCommonCode((prev) => ({ ...prev, useYn: e.target.value }))}
                        />

                        <label>No</label>
                        <StyledInput
                            type='radio'
                            name='useYn'
                            value={"N"}
                            checked={commonCode.useYn === "N"}
                            onChange={(e) => setCommonCode((prev) => ({ ...prev, useYn: e.target.value }))}
                        />
                    </div>
                </label>
                <div className={"button-container"}>
                    <button type='button' onClick={groupId ? updateCommonCode : insertCommonCode}>
                        {groupId ? "수정" : "저장"}
                    </button>
                    {!!groupId && (
                        <button type='button' onClick={deleteCommonCode}>
                            삭제
                        </button>
                    )}
                    <button type='button' onClick={() => setModal(!modal)}>
                        나가기
                    </button>
                </div>
            </div>
        </CommonCodeModalStyle>
    );
};
