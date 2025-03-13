import { useEffect, useRef, useState } from "react";
import { FC } from "react";
import { UserInfoModalStyle } from "../../UserInfo/UserInfoModal/styled";
import { StyledInput } from "../../../../common/StyledInput/StyledInput";
import { sarchWarehouseInfoDetailApi } from "../../../../../api/WarehouseInfoApi/sarchWarehouseInfoDetailApi";
import { WarehouseInfo } from "../../../../../api/api";
import DaumPostcode from "react-daum-postcode";
import { StyledButton } from "../../../../common/StyledButton/StyledButton";
import { detailModalState } from "../../../../../stores/modalState";
import { modalState } from "../../../../../stores/modalState";
import { useRecoilState } from "recoil";

import { IDetailWareHouse, IUpdateWareHouseRequestDTO } from "../../../../../models/interface/IWarehouse";
import { IWarehouseInfoDetailResponse } from "../../../../../models/interface/IWarehouse";
import { postWarehouseInfoUpdateApi } from "../../../../../api/WarehouseInfoApi/postWarehouseInfoUpdateApi";
import { IPostWareHouseResponse } from "../../../../../models/interface/IWarehouse";
import { WarehouseInfoContext } from "../../../../../api/Provider/WarehouseInfo/WarehouseInfoProvider";
import { useContext } from "react";
import { postwarehouseInfoSaveApi } from "../../../../../api/WarehouseInfoApi/postwarehouseInfoSaveApi";
import { postWarehouseInfoDeleteApi } from "../../../../../api/WarehouseInfoApi/postWarehouseInfoDeleteApi";
import { DefaultWareSearchKeyWord } from "../defaultSearchKeyWord/DefaultWareSearchKeyWord";
import { PostRender } from "../../PostRender/PostRender";
interface IProductInfoModalProps {
    warehouseId: number | undefined;
}

const emptyCheck = {
    warehouseCode: "창고코드 번호 입력인 필수입니다.", // warehouseCode는 number
    name: "창고명은 입력은 필수 입니다.",
    manager: "담당자는 입력은 필수 입니다.", // manager는 string
    email: "이메일 입력은 필수 입니다.", // email은 string
    phone: "연락처 입력은 필수 입니다.", // phone은 string
    zipCode: "우편 번호 입력은 필수입니다. 우편번호 찾기 버튼을 클릭해주세요", // zipCode는 number// address는 string
};

const valiCheck = {
    email: "이메일 형식이 옳바르지 않습니다.", // email은 string
    phone: "핸드폰 형식이 옳바르지 않습니다.\n 하이픈 여부 상관없이 3자리-3~4자리-3~4 자리 입력하시면됩니다.",
};

export const WarehouseInfoModal: FC<IProductInfoModalProps> = ({ warehouseId }) => {
    const [isPostcodeOpen, setIsPostcodeOpen] = useState(false);
    const [updateDetail, setUpdateDetail] = useState<IDetailWareHouse>();
    const [insertDetail, setInsertDetail] = useState<IDetailWareHouse>({
        warehouseId: -1, // warehouseId는 number
        warehouseCode: -1, // warehouseCode는 number
        name: "", // name은 string
        manager: "", // manager는 string
        email: "", // email은 string
        phone: "", // phone은 string
        zipCode: -1, // zipCode는 number
        address: "", // address는 string
    });
    const [detailModal, setDetailModal] = useRecoilState(detailModalState);
    const [insertModal, setInsertModal] = useRecoilState(modalState);
    const phonRef = useRef<string>("");
    const { searchKeyword, setSearchKeyword } = useContext(WarehouseInfoContext);
    useEffect(() => {
        console.log(warehouseId === undefined);
        if (warehouseId != undefined) {
            initUpdateFnc();
        }

        async function initUpdateFnc() {
            const res: IWarehouseInfoDetailResponse = await sarchWarehouseInfoDetailApi(
                WarehouseInfo.warehouseInfoDetail,
                {
                    warehouseId: warehouseId,
                }
            );
            setUpdateDetail(res.detailValue);
        }
    }, []);

    const insertHandler = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        // console.log(`네임: ${name}     밸류: ${value}`);

        setInsertDetail((prev) => {
            return {
                ...prev, // 이전 상태를 복사하고
                [name]: value, // 변경된 값을 동적으로 적용
            };
        });
    };

    const inputHandler = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        // console.log(`네임: ${name}     밸류: ${value}`);

        setUpdateDetail((prev) => {
            return {
                ...prev, // 이전 상태를 복사하고
                [name]: value, // 변경된 값을 동적으로 적용
            };
        });
    };

    useEffect(() => {
        console.log(updateDetail);
    }, [updateDetail]);

    const handleAddressSelect = (data: any) => {
        alert("업데이트시에만");
        let address = data.roadAddress; // 도로명 주소
        if (!address) address = data.jibunAddress; // 지번 주소
        // console.log("우편번호: " + data.zonecode);
        // console.log("주소: " + address);
        //분기점

        updateDetail.zipCode = data.zonecode; // 우편번호
        updateDetail.address = address; // 주소

        setUpdateDetail((prev) => {
            return {
                ...prev,
            };
        });

        // 팝업 닫기
        setIsPostcodeOpen(false);
    };

    const insertHandleAddressSelect = (data: any) => {
        alert("정보를삽입시에만");
        let address = data.roadAddress; // 도로명 주소
        if (!address) address = data.jibunAddress; // 지번 주소
        // console.log("우편번호: " + data.zonecode);
        // console.log("주소: " + address);
        setInsertDetail((prev) => {
            insertDetail.zipCode = data.zonecode; // 우편번호
            insertDetail.address = address; // 주소
            return {
                ...prev,
            };
        });

        // 팝업 닫기
        setIsPostcodeOpen(false);
    };

    const goInsert = async () => {
        if (!emptyCheckFnc()) {
            return;
        }
        if (!valiCheckFnc()) {
            return;
        }
        const insertRequestDto = toInsertRequestDto();

        console.log(insertRequestDto);

        const res: IPostWareHouseResponse = await postwarehouseInfoSaveApi(
            WarehouseInfo.warehouseInfoSave,
            insertRequestDto
        );
        if (res.result === "success") {
            alert("창고정보 저장에 성공하였습니다.");

            PostRender(DefaultWareSearchKeyWord, setSearchKeyword);

            // setInsertModal(!insertModal);
            // setSearchKeyword({
            //     searchTarget: "warehouseName",
            //     searchKeyword: "",
            //     currentPage: 1,
            //     pageSize: 5,
            // });
        }
    };

    const goUpdateFnc = async () => {
        if (!emptyCheckFnc()) {
            return;
        }
        if (!valiCheckFnc()) {
            return;
        }

        const updateRequestDto = toUpdateRequestDto();
        console.log(updateRequestDto);
        const res: IPostWareHouseResponse = await postWarehouseInfoUpdateApi(
            WarehouseInfo.warehouseInfoUpdate,
            updateRequestDto
        );
        if (res.result === "success") {
            alert("정보 수정에 성공하였습니다.");
            setDetailModal(!detailModal);
            PostRender(DefaultWareSearchKeyWord, setSearchKeyword);
            // setSearchKeyword({
            //     searchTarget: "warehouseName",
            //     searchKeyword: "",
            //     currentPage: 1,
            //     pageSize: 5,
            // });
        }
    };

    const emptyCheckFnc = (): boolean => {
        var box;
        console.log(warehouseId === undefined);
        if (warehouseId === undefined) {
            box = insertDetail;
        } else {
            box = updateDetail;
        }

        for (var key in emptyCheck) {
            if (box[key] === "" || box[key] < 0) {
                alert(emptyCheck[key]);
                return false;
            }
        }

        return true;
    };

    const valiCheckFnc = (): boolean => {
        for (var key in valiCheck) {
            if (!valiCheckSwitch(key)) {
                return false;
            }
        }

        return true;
    };

    const valiCheckSwitch = (name: string): boolean => {
        switch (
            true // 항상 true로 설정하고 각 조건을 체크
        ) {
            case name === "phone":
                // 전화번호 유효성 검사 함수 호출
                return validatePhone(name);

            case name === "email":
                return valiEmail(name);

            default:
                return false;
        }
    };

    const validatePhone = (name: string): boolean => {
        // 각 필드의 값 가져오기

        var cleanedPhone;
        console.log(warehouseId === undefined);
        if (warehouseId === undefined) {
            cleanedPhone = insertDetail.phone;
        } else {
            cleanedPhone = updateDetail.phone;
        }

        console.log(`naeme: ${name}  cleanedPhone; ${cleanedPhone} `);
        // 전화번호 형식 검사
        // 1. 앞자리는 2~3자리 숫자이고, '00'이나 '000'을 포함하면 안됨
        // 2. 중간과 마지막 자리는 3~4자리 숫자
        const phoneRegex = /^(?!00)(?!000)\d{2}[-]?\d{3,4}[-]?\d{3,4}$|^(?!000)\d{3}[-]?\d{3,4}[-]?\d{3,4}$/;

        //IUpdateRequestDTO

        // 정규식으로 검증
        if (phoneRegex.test(cleanedPhone)) {
            // 하이픈이 없으면 자동으로 추가
            if (!cleanedPhone.includes("-")) {
                // 하이픈 추가: (XXX)-(XXXX)-(XXXX) 형태로 포맷팅
                const formattedPhone = cleanedPhone.replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, "$1-$2-$3");
                phonRef.current = formattedPhone;
                console.log("Formatted Phone:", formattedPhone); // 확인용
                return true; // 하이픈이 자동으로 추가된 전화번호 반환
            }
            phonRef.current = cleanedPhone;
            console.log("Formatted Phone:", cleanedPhone); // 확인용
            return true;
        } else {
            alert("유효하지 않은 전화번호입니다.");
            phonRef.current = "";
            return false;
        }
    };

    const valiEmail = (name: string): boolean => {
        const emailRules: RegExp = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;

        var targetEmail;
        console.log(warehouseId === undefined);
        if (warehouseId === undefined) {
            targetEmail = insertDetail.email;
        } else {
            targetEmail = updateDetail.email;
        }

        if (!emailRules.test(targetEmail)) {
            alert("이메일 형식을 확인해주세요");

            return false;
        }

        return true;
    };

    const toInsertRequestDto = (): IUpdateWareHouseRequestDTO => {
        const insertRequestDto: IUpdateWareHouseRequestDTO = {
            warehouseId: -1,
            warehouseCode: -1,
            name: "",
            manager: "",
            email: "",
            emailDomain: null,
            phone: "",
            zipCode: -1,
            address: "",
            detailAddress: "",
            empty: "",
            toPhone: "",
        };

        for (var key in insertRequestDto) {
            if (key === "toPhone") {
                insertRequestDto[key] = phonRef.current;
            } else {
                insertRequestDto[key] = insertDetail[key];
            }
        }

        return insertRequestDto;
    };

    const toUpdateRequestDto = (): IUpdateWareHouseRequestDTO => {
        const updateRequestDto: IUpdateWareHouseRequestDTO = {
            warehouseId: -1,
            warehouseCode: -1,
            name: "",
            manager: "",
            email: "",
            emailDomain: null,
            phone: "",
            zipCode: -1,
            address: "",
            detailAddress: "",
            empty: "",
            toPhone: "",
        };

        for (var key in updateRequestDto) {
            if (key === "toPhone") {
                updateRequestDto[key] = phonRef.current;
            } else {
                updateRequestDto[key] = updateDetail[key];
            }
        }

        return updateRequestDto;
    };

    const goDeleteFnc = async () => {
        alert(warehouseId);
        const res: IPostWareHouseResponse = await postWarehouseInfoDeleteApi(WarehouseInfo.warehouseInfoDelete, {
            warehouseId: warehouseId,
        });

        if (res.result === "success") {
            alert("창고 정보를 삭제 하였습니다.");
            setInsertModal(!insertModal);
            PostRender(DefaultWareSearchKeyWord, setSearchKeyword);
            // setSearchKeyword({
            //     searchTarget: "warehouseName",
            //     searchKeyword: "",
            //     currentPage: 1,
            //     pageSize: 5,
            // });
        } else if (res.result === "fail") {
            alert("잠시후 다시 시도해주세요");
        } else {
            alert(
                "\n" +
                    "-창고 철회 거절 메시지-" +
                    "\n" +
                    `해당 ${updateDetail.name}  창고는 현재 제품을 운용중에 있습니다. ` +
                    "\n" +
                    "\n" +
                    `해당 창고관리자 이름:${updateDetail.manager} ` +
                    "\n" +
                    "\n" +
                    `해당 창고관리자 연락처 :${updateDetail.phone} ` +
                    "\n" +
                    "\n" +
                    "로 문의 해주시길 바랍니다."
            );
        }
    };

    return (
        <>
            <UserInfoModalStyle>
                {/* 1열 */}
                <div className='container'>
                    <table>
                        <colgroup>
                            <col width='12%' />
                            <col width='12%' />
                            <col width='12%' />
                            <col width='12%' />
                            <col width='12%' />
                            <col width='12%' />
                        </colgroup>
                        <thead>
                            <tr></tr>
                        </thead>
                        <tbody id='dataList'>
                            <tr>
                                <th colSpan={2} scope='row'>
                                    창고코드<span className='font_red'>*</span>
                                </th>
                                <td colSpan={7}>
                                    {warehouseId === undefined ? (
                                        <>
                                            <StyledInput
                                                type='text'
                                                className='inputTxt p100'
                                                name='warehouseCode'
                                                id='warehouseCode'
                                                onChange={insertHandler}
                                                value={
                                                    insertDetail?.warehouseCode < 0 ? "" : insertDetail?.warehouseCode
                                                }
                                            />
                                        </>
                                    ) : (
                                        <>
                                            <StyledInput
                                                type='text'
                                                className='inputTxt p100'
                                                name='warehouseCode'
                                                id='warehouseCode'
                                                onChange={inputHandler}
                                                value={updateDetail?.warehouseCode}
                                            />
                                        </>
                                    )}
                                </td>
                            </tr>
                            <tr>
                                <th colSpan={2} scope='row'>
                                    창고명<span className='font_red'>*</span>
                                </th>
                                <td colSpan={7}>
                                    {warehouseId === undefined ? (
                                        <>
                                            {" "}
                                            <StyledInput
                                                type='text'
                                                className='inputTxt p100'
                                                name='name'
                                                id='name'
                                                value={insertDetail?.name}
                                                onChange={insertHandler}
                                            />
                                        </>
                                    ) : (
                                        <>
                                            <StyledInput
                                                type='text'
                                                className='inputTxt p100'
                                                name='name'
                                                id='name'
                                                value={updateDetail?.name}
                                                onChange={inputHandler}
                                            />
                                        </>
                                    )}
                                </td>
                            </tr>
                            <tr>
                                <th colSpan={2} scope='row'>
                                    담당자<span className='font_red'>*</span>
                                </th>
                                <td colSpan={7}>
                                    {warehouseId === undefined ? (
                                        <>
                                            <StyledInput
                                                type='text'
                                                className='inputTxt p100'
                                                name='manager'
                                                id='manager'
                                                value={insertDetail?.manager}
                                                onChange={insertHandler}
                                            />
                                        </>
                                    ) : (
                                        <>
                                            <StyledInput
                                                type='text'
                                                className='inputTxt p100'
                                                name='manager'
                                                id='manager'
                                                value={updateDetail?.manager}
                                                onChange={inputHandler}
                                            />
                                        </>
                                    )}
                                </td>
                            </tr>
                            <tr>
                                <th colSpan={2} scope='row'>
                                    이메일<span className='font_red'>*</span>
                                </th>

                                <td colSpan={7}>
                                    {warehouseId === undefined ? (
                                        <>
                                            <StyledInput
                                                type='text'
                                                className='inputTxt p100'
                                                name='email'
                                                id='email'
                                                style={{ width: "100%" }}
                                                value={insertDetail?.email}
                                                onChange={insertHandler}
                                            />
                                        </>
                                    ) : (
                                        <>
                                            <StyledInput
                                                type='text'
                                                className='inputTxt p100'
                                                name='email'
                                                id='email'
                                                style={{ width: "100%" }}
                                                value={updateDetail?.email}
                                                onChange={inputHandler}
                                            />
                                        </>
                                    )}
                                </td>
                            </tr>
                            <tr>
                                <th colSpan={2} scope='row'>
                                    전화번호<span className='font_red'>*</span>
                                </th>
                                <td colSpan={7}>
                                    {warehouseId === undefined ? (
                                        <>
                                            <StyledInput
                                                type='text'
                                                className='inputTxt p100'
                                                name='phone'
                                                id='phone1'
                                                value={insertDetail?.phone}
                                                onChange={insertHandler}
                                            />
                                        </>
                                    ) : (
                                        <>
                                            <StyledInput
                                                type='text'
                                                className='inputTxt p100'
                                                name='phone'
                                                id='phone1'
                                                value={updateDetail?.phone}
                                                onChange={inputHandler}
                                            />
                                        </>
                                    )}
                                </td>
                            </tr>
                            <tr>
                                <th colSpan={2} scope='row'>
                                    우편번호<span className='font_red'>*</span>
                                </th>
                                <td colSpan={5}>
                                    {warehouseId === undefined ? (
                                        <>
                                            <StyledInput
                                                type='text'
                                                className='inputTxt p100'
                                                name='zipCode'
                                                id='zipCode'
                                                value={insertDetail?.zipCode < 0 ? "" : insertDetail?.zipCode}
                                            />
                                        </>
                                    ) : (
                                        <>
                                            <StyledInput
                                                type='text'
                                                className='inputTxt p100'
                                                name='zipCode'
                                                id='zipCode'
                                                value={updateDetail?.zipCode}
                                            />
                                        </>
                                    )}
                                </td>
                                {/*  */}
                                <td colSpan={2}>
                                    <StyledButton onClick={() => setIsPostcodeOpen(true)}>우편번호 찾기</StyledButton>
                                    {isPostcodeOpen ? (
                                        <>
                                            {warehouseId != undefined ? (
                                                <>
                                                    <DaumPostcode onComplete={handleAddressSelect} />
                                                </>
                                            ) : (
                                                <>
                                                    <DaumPostcode onComplete={insertHandleAddressSelect} />
                                                </>
                                            )}
                                        </>
                                    ) : (
                                        <></>
                                    )}
                                </td>
                            </tr>
                            <tr>
                                <th colSpan={2} scope='row'>
                                    창고위치<span className='font_red'>*</span>
                                </th>
                                <td colSpan={8}>
                                    {warehouseId === undefined ? (
                                        <>
                                            <StyledInput
                                                style={{ width: "100%" }}
                                                name='address'
                                                id='address'
                                                value={insertDetail?.address}
                                            ></StyledInput>
                                        </>
                                    ) : (
                                        <>
                                            <StyledInput
                                                style={{ width: "100%" }}
                                                name='address'
                                                id='address'
                                                value={updateDetail?.address}
                                            ></StyledInput>
                                        </>
                                    )}
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <div className='btn_areaC mt30'>
                        {warehouseId != undefined ? (
                            <>
                                <StyledButton onClick={goUpdateFnc}>수정</StyledButton>
                                <StyledButton onClick={goDeleteFnc}>삭제</StyledButton>
                            </>
                        ) : (
                            <>
                                <StyledButton onClick={goInsert}>저장</StyledButton>
                            </>
                        )}
                        <StyledButton
                            onClick={() => {
                                warehouseId != undefined ? setDetailModal(!detailModal) : setInsertModal(!insertModal);
                            }}
                        >
                            취소
                        </StyledButton>
                    </div>
                </div>
            </UserInfoModalStyle>
        </>
    );
};
