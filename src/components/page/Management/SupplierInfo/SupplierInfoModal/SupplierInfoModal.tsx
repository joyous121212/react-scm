import DaumPostcode from "react-daum-postcode";
import axios, { AxiosResponse } from "axios";
import { UserInfoModalStyle } from "../../UserInfo/UserInfoModal/styled";
import { FC, useEffect, useState } from "react";
import {
    IDeleteSupplyDetailRespose,
    IRecoverSupplyDetailRespose,
    ISaveSupplyDetailRespose,
    ISupplierInfoDetailResponse,
    IUpdateSupplyDetailRespose,
} from "../../../../../models/interface/SupplierInfoS";
import { ISupplierInfoDetailDto } from "../../../../../models/interface/SupplierInfoS";
import { searchSupplyDetailApi } from "../../../../../api/SupplierInfoApi/searchSupplyDetailApi";
import { StyledButton } from "../../../../common/StyledButton/StyledButton";
import { useRecoilState } from "recoil";
import { detailModalState, modalState } from "../../../../../stores/modalState";
import { ISupplierInfoDetailRequestDto } from "../../../../../models/interface/SupplierInfoS";
import { ISupplierInfoSaveDetailDto } from "../../../../../models/interface/SupplierInfoS";
import { ISupplierSaveDetailRequestDto } from "../../../../../models/interface/SupplierInfoS";
import { postSaveSupplyDetail } from "../../../../../api/SupplierInfoApi/postSaveSupplyDetail";

import { postUpdateSupplyDetail } from "../../../../../api/SupplierInfoApi/postUpdateSupplyDetail";
import { SupplierInfo } from "../../../../../api/api";
import { ISupplierSaveInfoDetail } from "../../../../../models/interface/SupplierInfoS";
import { ManageMentWrapperButtonStyle } from "../../ManageMentStyle/ManageMentWrapperButtonStyle/ManageMentWrapperButtonStyle";
import { ManageMentStyledButton } from "../../ManageMentStyle/ManageMentStyledButton/ManageMentStyledButton";
export interface SupplierDetailInfoModalProps {
    supplyId?: string;
    detailModal?: boolean; // 프롭 타입 설정
    // setUserDetail: React.Dispatch<React.SetStateAction<any>>;
}
import { ISupplierInfoDetail } from "../../../../../models/interface/SupplierInfoS";
import { StyledInput } from "../../../../common/StyledInput/StyledInput";
import { Portal } from "../../../../common/potal/Portal";
import { useRef } from "react";
import { postDeleteSupplyDetail } from "../../../../../api/SupplierInfoApi/postDeleteSupplyDetail";
import { idDuplicCheck } from "../../../../../api/SupplierInfoApi/idDuplicCheck";

const emptyMessage = {
    //supplyId:string;
    name: "납품업체명은 필수입력 사항입니다.",
    manager: "담당자는 필수입력 사항입니다.",
    phone: "연락쳐는 필수입력 사항입니다.",
    ZipCode: "우편번호는 필수입력 사항입니다.",
    address: "우편번번호 버튼 클릭후 선택해주세요",
    // password: "비밀번호는 필수입력 사항 입니다.",
};
//업데이트 시는 또 아이디는 수정 불가라 살짝 다르다. 즉 전화번호만
const upDateValiMessage = {
    phone: "전화번호 형식에 맞지 않습니다.\n ex)하이픈 있던없던[3자리]-[3~4자리]-[3~4자리] (o) ",
};

const saveValiMessage = {
    // supplyLoginID: "중복확인을 먼저 해주셔야합니데이",
    // password: "비밀번호 형식에 맞이 않습니다. \n ex)숫자 영문자 조합으로 6자리 입니다.",
    phone: "전화번호 형식에 맞지 않습니다.\n ex)하이픈 있던없던[3자리]-[3~4자리]-[3~4자리] (o) ",
};

const saveEmptyMessage = {
    // supplyLoginID: "아이디는 필수 입력 사항입니다.",
    name: "납품업체명은 필수입력 사항입니다.",
    manager: "담당자는 필수입력 사항입니다.",
    phone: "연락쳐는 필수입력 사항입니다.",
    ZipCode: "우편번호는 필수입력 사항입니다.",
    address: "우편번번호 버튼 클릭후 선택해주세요",
    // password: "비밀번호는 필수입력 사항 입니다.",
};

export const SupplierInfoModal: FC<SupplierDetailInfoModalProps> = ({ supplyId }) => {
    const statusRef = useRef<string>();
    const [isPostcodeOpen, setIsPostcodeOpen] = useState(false);

    const [modal, setModal] = useRecoilState(modalState);
    const [detailModal, setDetailModal] = useRecoilState(detailModalState);

    const phRef = useRef<string>("");

    const [saveDetail, setSaveDetail] = useState<ISupplierSaveInfoDetail>({
        // supply_id AS supplyId
        supplyLoginID: "",
        name: "",
        manager: "",
        phone: "",
        // zip_code AS zipCode
        zipCode: "",
        address: "",

        // detail_address AS detailAddress
        detailAddress: "",
        loginID: "",
        password: "",
        // group_code AS groupCode
        groupCode: "S10000T1",
        // create_by AS author
        author: "",
        // created_date AS createdDate
        createdDate: "",
        // trade_state AS tradeState
        tradeState: "Y",
    });

    const idRef = useRef<boolean>(false);

    const [supDetail, setSupDetail] = useState<ISupplierInfoDetail>();

    // 이하는 새로운 정보를삽입 하는 로직
    // 또한  아래처럼 보냄을 상기하자.

    // var param = {
    // 		name: $("#supplyName").val()
    // 	, 	manager: $("#supplyManager").val()
    // 	,	phone: $("#supplyPhone").val()
    // 	,	ZipCode: $("#supplyZipCode").val()
    // 	,	address: $("#supplyAddress").val()
    // 	,	detailAddress: $("#supplyDetailAddress").val()
    // 	,	supplyLoginID: $("#supplyLoginID").val()
    // 	,	password: $("#password").val()
    // 	,	groupCode: $("#groupCode").val()
    // 	,	tradeState	: $("input[name='TradeState']:checked").val()
    // }

    const saveRequest: ISupplierSaveDetailRequestDto = {
        toSaveRequestDto: {
            name: "", // 공급자 이름
            manager: "", // 관리자 이름
            phone: "", // 전화번호
            ZipCode: "", // 우편번호
            address: "", // 주소
            detailAddress: "", // 상세 주소
            supplyLoginID: "", // 로그인 ID
            password: "", // 비밀번호
            groupCode: "", // 그룹 코드
            tradeState: "", // 거래 상태
        },
    };

    const closeSaveDetailModal = () => {
        setModal(!modal);
    };

    const goSaveFnc = async () => {
        // 0필수립력 체크: emptyCheck
        if (!saveEmptyCheck(saveDetail)) {
            return;
        }

        //1 유효성 체크: 업데이트시는  전화번호만 있다.
        for (var key in saveValiMessage) {
            if (!saveValiSwitch(key)) {
                alert(saveValiMessage[key]);
                return;
            }
        }

        //3 name값 보정:toSaveRequestDto

        const request = toSaveRequestDto(saveDetail);

        console.log("---보내기 직전");
        console.log(request);
        console.log("---보내기 직전");

        const res: ISaveSupplyDetailRespose = await postSaveSupplyDetail(SupplierInfo.saveSupplyDetail, request);

        if (res.result === "success") {
            alert("등록이 완료되었습니다.");
            window.location.href = "/react/management/supplier-info";
        } else {
            alert("잠시후 다시 시도해주세요");
            window.location.href = "/react/management/supplier-info";
        }
    };

    const toSaveRequestDto = (saveDetail): ISupplierInfoSaveDetailDto => {
        for (var key in saveDetail) {
            //	console.log(`key:  ${key} `)
            if (key === "phone") {
                saveRequest.toSaveRequestDto[key] = phRef.current;
                //alert("ref"+request.toRequestDto[key])
            } else {
                // let changeKey = keyChange(key);
                saveRequest.toSaveRequestDto[key] = saveDetail[key];
                //console.log(`key:${key}   변형된 key: ${changeKey} \n  toRequestDto 의 value: ${request.toSaveRequestDto[key]} supDetail 의 valye: ${saveDetail[key]}`)
            }
        }

        return saveRequest.toSaveRequestDto;
    };

    const saveEmptyCheck = (saveDetail): boolean => {
        for (var key in saveEmptyMessage) {
            if (saveDetail[key] === "") {
                alert(saveEmptyMessage[key]);
                return false;
            }
        }

        return true;
    };

    const saveValiSwitch = (name: string): boolean => {
        switch (
            true // 항상 true로 설정하고 각 조건을 체크
        ) {
            case name === "supplyLoginID":
                return idRef.current;

            case name === "phone":
                // 전화번호 유효성 검사 함수 호출
                return phoneValidateInput(saveDetail.phone);

            case name === "password":
                return PasswordValidateInput(saveDetail.password);

            default:
                return false;
        }
    };

    const PasswordValidateInput = (value: string): boolean => {
        const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6}$/;
        return regex.test(value);
    };

    const handleSaveChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        //detailInfo
        console.log(`네임: ${name}     밸류: ${value}`);
        setSaveDetail((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const updateStatus = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        //detailInfo
        console.log(`네임: ${name}     밸류: ${value}`);
        setSupDetail((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    //아이디 중복체크
    const goIdDuplicCheckFnc = async () => {
        //var param = {"loginID" : $("#supplyLoginID").val()};
        //saveDetail.supplyLoginID

        const res: number = await idDuplicCheck(SupplierInfo.idDuplicCheck, { loginID: saveDetail.supplyLoginID });

        console.log(res);

        if (res === 1) {
            alert("이미 사용중인 아이디입니다.");
            idRef.current = false;
            return;
        }
        alert("사용가능한 아이디 입니다.");
        idRef.current = true;
    };

    const phoneValidateInput = (value: string): boolean => {
        //alert(value)
        // 하이픈을 제외한 숫자만 추출
        const cleanPhoneNumber = value.replace(/\D/g, "");

        // 10자리 또는 11자리 숫자만 허용
        if (cleanPhoneNumber.length !== 10 && cleanPhoneNumber.length !== 11) {
            return false; // 길이가 맞지 않으면 false 반환
        }

        // 하이픈을 포함한 전화번호 포맷으로 변환
        const formattedPhoneNumber = cleanPhoneNumber.replace(/^(\d{3})(\d{4})(\d{4})$/, "$1-$2-$3");

        // 하이픈 포함 전화번호 형식이 맞는지 체크
        const phoneRegex = /^(01[0-9])-(\d{3,4})-(\d{4})$/;

        //console.log("전화번호:  "+formattedPhoneNumber)

        const box = { ...saveDetail };
        box.phone = formattedPhoneNumber;
        setSaveDetail(box);
        phRef.current = formattedPhoneNumber;
        return phoneRegex.test(formattedPhoneNumber);
    };

    //이하는 업데이트를 위한 로직

    const request: ISupplierInfoDetailRequestDto = {
        toRequestDto: {
            supply_id: "",
            name: "",
            manager: "",
            phone: "",
            zip_code: "",
            address: "",
            detail_address: "",
            loginID: "",
            password: "",
            group_code: "",
            create_by: "",
            created_date: "",
            trade_state: "",
        },
    };
    // 상세모달 정보를 보기위한 useEffect
    useEffect(() => {
        if (supplyId != undefined) {
            console.log(supplyId);
            justCallFnc();
        }
        async function justCallFnc() {
            console.log(supplyId);
            const res: ISupplierInfoDetailResponse = await searchSupplyDetailApi(SupplierInfo.searchSupplyDetail, {
                supplyId: supplyId,
            });
            setSupDetail(res.detailValue);
            statusRef.current = res.detailValue.tradeState;
        }
    }, [supplyId]);

    const closeDetailModal = () => {
        setDetailModal(!detailModal);
    };

    const goUpdateFnc = async () => {
        // 0필수립력 체크: emptyCheck
        if (!emptyCheck(supDetail)) {
            return;
        }

        //1 유효성 체크: 업데이트시는  전화번호만 있다.
        for (var key in upDateValiMessage) {
            if (!updateValiSwitch(key)) {
                alert(upDateValiMessage[key]);
                return;
            }
        }

        //3 name값 보정:toRequestDto
        const RequestDto = toRequestDto(supDetail);

        console.log(supDetail);

        const res: IUpdateSupplyDetailRespose = await postUpdateSupplyDetail(
            SupplierInfo.updateSupplyDetail,
            supDetail
        );

        if (res.result === "success") {
            alert("정보 수정에 성공하였습니다.");
            window.location.href = "/react/management/supplier-info";
        } else if (res.result === "fail") {
            alert("잠시후 다시 시도해주세요");
            window.location.href = "/react/management/supplier-info";
        }
    };

    const goDeleteFnc = async () => {
        const res: IDeleteSupplyDetailRespose = await postDeleteSupplyDetail(SupplierInfo.deleteSupplyDetail, {
            supplyId: supDetail.supplyId,
        });

        if (res.result === "success") {
            alert("삭제 성공하였습니다.");
            window.location.href = "/react/management/supplier-info";
        } else {
            alert("잠시후 다시 시도해주세요");
            window.location.href = "/react/management/supplier-info";
        }
    };

    const goRecoverFnc = async () => {
        const res: IRecoverSupplyDetailRespose = await postDeleteSupplyDetail(SupplierInfo.recoverSupplyDetail, {
            supplyId: supDetail.supplyId,
        });

        if (res.result === "success") {
            alert("거래 재개 상태로 변경되었습니다.");
            window.location.href = "/react/management/supplier-info";
        } else {
            alert("잠시후 다시 시도해주세요");
            window.location.href = "/react/management/supplier-info";
        }
    };

    const emptyCheck = (supDetail): boolean => {
        for (var key in emptyMessage) {
            if (supDetail[key] === "") {
                alert(emptyMessage[key]);
                return false;
            }
        }

        return true;
    };

    const updateValiSwitch = (name: string): boolean => {
        switch (
            true // 항상 true로 설정하고 각 조건을 체크
        ) {
            case name === "phone":
                // 전화번호 유효성 검사 함수 호출
                return IdValidateInput(supDetail.phone);

            default:
                return false;
        }
    };

    const IdValidateInput = (value: string): boolean => {
        // 하이픈을 제외한 숫자만 추출
        const cleanPhoneNumber = value.replace(/\D/g, "");

        // 10자리 또는 11자리 숫자만 허용
        if (cleanPhoneNumber.length !== 10 && cleanPhoneNumber.length !== 11) {
            return false; // 길이가 맞지 않으면 false 반환
        }

        // 하이픈을 포함한 전화번호 포맷으로 변환
        const formattedPhoneNumber = cleanPhoneNumber.replace(/^(\d{3})(\d{4})(\d{4})$/, "$1-$2-$3");

        // 하이픈 포함 전화번호 형식이 맞는지 체크
        // 전화번호 형식에 대한 정규식 (두 번째 및 세 번째 자리에서 '00' 또는 '000' 방지)
        const phoneRegex = /^(?!00)(?!000)(\d{3})-(\d{3,4})-(\d{4})$/;

        //console.log("전화번호:  "+formattedPhoneNumber)

        phRef.current = formattedPhoneNumber;

        return phoneRegex.test(formattedPhoneNumber);
    };

    const keyChange = (str: string): string => {
        for (var key in request.toRequestDto) {
            // `key`에서 "-" 제거
            const keyWithoutDash = key.replace(/_/g, ""); // 모든 "-"를 제거
            //console.log(keyWithoutDash)
            if (keyWithoutDash.slice(0, 3).includes(str.slice(0, 3))) {
                //console.log(`리퀘스트 키 ${keyWithoutDash.slice(0, 3)}   대상key ${str.slice(0, 3)}   시작여부 ${keyWithoutDash.slice(0, 3).includes(str.slice(0, 3))}`)
                return key;
            }
        }
    };

    const toRequestDto = (supDetail): ISupplierInfoDetailDto => {
        for (var key in supDetail) {
            //	console.log(`key:  ${key} `)
            if (key === "phone") {
                request.toRequestDto[key] = phRef.current;
                //alert("ref"+request.toRequestDto[key])
            } else {
                let changeKey = keyChange(key);
                request.toRequestDto[changeKey] = supDetail[key];
                console.log(
                    `key:${key}   변형된 key: ${changeKey} \n  toRequestDto 의 value: ${request.toRequestDto[key]} supDetail 의 valye: ${supDetail[key]}`
                );
            }
        }

        return request.toRequestDto;
    };

    const handleAddressSearch = () => {
        new window.daum.Postcode({
            oncomplete: function (data: any) {
                let address = data.roadAddress; // 도로명 주소
                if (!address) address = data.jibunAddress; // 지번 주소
                // console.log("우편번호: " + data.zonecode);
                // console.log("주소: " + address);
                let box;
                if (detailModal) {
                    box = { ...supDetail };
                    box.zipCode = data.zonecode;
                    box.address = address;
                    setSupDetail(box);
                    setIsPostcodeOpen(false);
                } else {
                    box = { ...saveDetail };
                    box.zipCode = data.zonecode;
                    box.address = address;
                    setSaveDetail(box);
                    setIsPostcodeOpen(false);
                }
            },
        }).open();
    };

    const handleAddressSelect = (data: any) => {
        let address = data.roadAddress; // 도로명 주소
        if (!address) address = data.jibunAddress; // 지번 주소
        // console.log("우편번호: " + data.zonecode);
        // console.log("주소: " + address);
        let box;
        if (detailModal) {
            box = { ...supDetail };
            box.zipCode = data.zonecode;
            box.address = address;
            alert(box.zipCode);
            setSupDetail(box);
            setIsPostcodeOpen(false);
        } else {
            box = { ...saveDetail };
            box.zipCode = data.zonecode;
            box.address = address;
            alert(box.zipCode);
            setSaveDetail(box);
            setIsPostcodeOpen(false);
        }
    };

    const handleUpdateChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        //detailInfo
        console.log(`네임: ${name}     밸류: ${value}`);
        setSupDetail((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handlePhonUpdateChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        //detailInfo
        console.log(`네임: ${name}     밸류: ${value}`);
        setSupDetail((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    return (
        <>
            <UserInfoModalStyle>
                {/* 1열 */}
                <div className='container'>
                    <dt>
                        <strong>납품업체 정보</strong>
                    </dt>
                    <table>
                        <colgroup>
                            <col width='30%' />
                            <col width='30%' />
                            <col width='30%' />
                        </colgroup>
                        <tbody>
                            {supDetail ? (
                                <>
                                    <tr id='writer'>
                                        <th scope='row'>작성자 </th>
                                        <td colSpan={1}>
                                            <div className='inputTxt p100' id='author'>
                                                {supDetail ? (
                                                    <StyledInput
                                                        name='author'
                                                        value={supDetail.author}
                                                        readOnly
                                                    ></StyledInput>
                                                ) : (
                                                    <></>
                                                    // <StyledInput type="text"
                                                    // 	name="author" id="supplyLoginID"  placeholder="숫자, 영문자 조합으로 6~20자리" />
                                                )}
                                            </div>
                                        </td>
                                        <th scope='row'>작성일</th>
                                        <td colSpan={1}>
                                            <div className='inputTxt p100' id='createdDate'>
                                                {supDetail ? (
                                                    <StyledInput
                                                        name='createdDate'
                                                        value={
                                                            new Date(supDetail.createdDate).toISOString().split("T")[0]
                                                        }
                                                        readOnly
                                                    ></StyledInput>
                                                ) : (
                                                    <StyledInput
                                                        type='text'
                                                        name='createdDate'
                                                        id='supplyLoginID'
                                                        placeholder='숫자, 영문자 조합으로 6~20자리'
                                                    />
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                </>
                            ) : (
                                <></>
                            )}
                            {/* 아이디 관련 tr 태그는 DB수정중으로 주석처리하고 최종 회의후 삭제결정할것이다. */}
                            {/* <tr>
                                <th scope='row'>
                                    아이디<span className='font_red'>*</span>
                                </th>
                                <td colSpan={2}>
                                    {supDetail ? (
                                        <StyledInput name='loginID' value={supDetail.loginID} readOnly></StyledInput>
                                    ) : (
                                        <StyledInput
                                            type='text'
                                            className='inputTxt p100'
                                            name='supplyLoginID'
                                            id='supplyLoginID'
                                            value={saveDetail.supplyLoginID}
                                            onChange={handleSaveChange}
                                            placeholder='숫자, 영문자 조합으로 6~20자리'
                                        />
                                    )}
                                </td>

                                {supDetail ? (
                                    <></>
                                ) : (
                                    <>
                                        <td colSpan={1}>
                                            <StyledInput
                                                type='button'
                                                value='중복확인'
                                                id='IdCheckBtn'
                                                onClick={goIdDuplicCheckFnc}
                                            />
                                        </td>
                                    </>
                                )}
                            </tr> */}
                            <tr id=''>
                                <th scope='row'>
                                    납품업체명<span className='font_red'>*</span>
                                </th>
                                <td colSpan={3}>
                                    {supDetail ? (
                                        <StyledInput
                                            size='modal'
                                            name='name'
                                            value={supDetail.name}
                                            onChange={handleUpdateChange}
                                        ></StyledInput>
                                    ) : (
                                        <StyledInput
                                            size='modal'
                                            type='text'
                                            name='name'
                                            id='supplyLoginID'
                                            value={saveDetail.name}
                                            onChange={handleSaveChange}
                                            placeholder='숫자, 영문자 조합으로 6~20자리'
                                        />
                                    )}
                                </td>
                            </tr>
                            <tr>
                                <th scope='row'>
                                    담당자명<span className='font_red'>*</span>
                                </th>
                                <td colSpan={3}>
                                    {supDetail ? (
                                        <StyledInput
                                            size='modal'
                                            name='manager'
                                            value={supDetail.manager}
                                            onChange={handleUpdateChange}
                                        ></StyledInput>
                                    ) : (
                                        <StyledInput
                                            size='modal'
                                            type='text'
                                            name='manager'
                                            value={saveDetail.manager}
                                            onChange={handleSaveChange}
                                        />
                                    )}
                                </td>
                            </tr>
                            <tr>
                                <th scope='row'>
                                    담당자 연락처<span className='font_red'>*</span>
                                </th>
                                <td colSpan={3}>
                                    {/* 주의 사항 프론트에선 supplyPhone 네임으로 보내야한다. 허나 코드가 꼬이니
									axio 요청전 supplyName 으로 보내면 된다 이런게 몇개들이 있으니 주의
								<input type="text" className="inputTxt p100" name="supplyPhone" id="supplyPhone" placeholder="숫자만 입력 가능합니다."
								/>
								*/}

                                    {supDetail ? (
                                        <StyledInput
                                            size='modal'
                                            name='phone'
                                            value={supDetail.phone}
                                            onChange={handleUpdateChange}
                                        ></StyledInput>
                                    ) : (
                                        <StyledInput
                                            size='modal'
                                            type='text'
                                            name='phone'
                                            id='supplyLoginID'
                                            value={saveDetail.phone}
                                            onChange={handleSaveChange}
                                            placeholder='하이픈상관없이전화번호입력'
                                        />
                                    )}
                                </td>
                            </tr>
                            <tr>
                                <th scope='row'>
                                    우편번호<span className='font_red'>*</span>
                                </th>
                                <td colSpan={2}>
                                    {/* 서버로 보낼시 name=zipCode 
								<input type="text" className="inputTxt p100"name="supplyZipCode" id="supplyZipCode" readOnly />
								*/}

                                    {supDetail ? (
                                        <StyledInput name='ZipCode' value={supDetail.zipCode} readOnly></StyledInput>
                                    ) : (
                                        <StyledInput
                                            type='text'
                                            name='ZipCode'
                                            id='supplyLoginID'
                                            value={saveDetail.zipCode}
                                            readOnly
                                        />
                                    )}
                                </td>
                                <td colSpan={1}>
                                    <StyledButton onClick={handleAddressSearch}>우편번호 찾기</StyledButton>
                                </td>
                            </tr>
                            <tr>
                                <th scope='row'>
                                    주소<span className='font_red'>*</span>
                                </th>
                                <td colSpan={3}>
                                    {/* 서버로 보낼시 name=supplyAddress 
									<input type="text" className="inputTxt p100" name="supplyAddress" id="supplyAddress" readOnly />
								*/}

                                    {supDetail ? (
                                        <StyledInput
                                            size='modal'
                                            name='address'
                                            value={supDetail.address}
                                            readOnly
                                        ></StyledInput>
                                    ) : (
                                        <StyledInput
                                            size='modal'
                                            type='text'
                                            name='address'
                                            id='supplyLoginID'
                                            value={saveDetail.address}
                                            placeholder='숫자, 영문자 조합으로 6~20자리'
                                        />
                                    )}
                                </td>
                            </tr>
                            <tr>
                                <th scope='row'>상세주소</th>
                                <td colSpan={3}>
                                    {/* 서버로 보낼시 name=supplyDetailAddress 
										<input type="text" className="inputTxt p100" name="supplyDetailAddress" id="supplyDetailAddress" />
								*/}

                                    {supDetail ? (
                                        <StyledInput
                                            size='modal'
                                            name='detailAddress'
                                            value={supDetail.detailAddress}
                                            onChange={handleUpdateChange}
                                        ></StyledInput>
                                    ) : (
                                        <StyledInput size='modal' type='text' name='detailAddress' id='supplyLoginID' />
                                    )}
                                </td>
                            </tr>

                            {/* 패스워드 tr 태그 부분은 역시 최종 회의후 삭제를 결정할 것으로 잠시 주석처리한다. */}
                            {/* <tr>
                                <th scope='row'>
                                    패스워드<span className='font_red'>*</span>
                                </th>
                                <td colSpan={3}>
                                    {supDetail ? (
                                        <StyledInput
                                            size='modal'
                                            name='password'
                                            type='password'
                                            value={supDetail.password}
                                            readOnly
                                        ></StyledInput>
                                    ) : (
                                        <StyledInput
                                            size='modal'
                                            type='text'
                                            name='password'
                                            id='supplyLoginID'
                                            value={saveDetail.password}
                                            onChange={handleSaveChange}
                                        />
                                    )}
                                </td>
                            </tr> */}
                            <tr>
                                <th scope='row'>
                                    거래상태 <span className='font_red'>*</span>
                                </th>
                                <td colSpan={3}>
                                    {/* 서버로 보낼시는 TradeState  */}
                                    {supDetail ? (
                                        <>
                                            <label>
                                                <StyledInput
                                                    type='radio'
                                                    name='tradeState'
                                                    id='TradeStateY'
                                                    value='Y'
                                                    onChange={updateStatus}
                                                    checked={supDetail?.tradeState === "Y"}
                                                />
                                                Yes
                                                <StyledInput
                                                    type='radio'
                                                    name='tradeState'
                                                    id='TradeStateN'
                                                    value='N'
                                                    onChange={updateStatus}
                                                    checked={supDetail?.tradeState === "N"}
                                                />
                                                No
                                            </label>
                                        </>
                                    ) : (
                                        <>
                                            <label>
                                                <StyledInput
                                                    type='radio'
                                                    name='tradeState'
                                                    id='TradeStateY'
                                                    value='Y'
                                                    checked
                                                    onChange={handleSaveChange}
                                                />{" "}
                                                Yes
                                                <StyledInput
                                                    type='radio'
                                                    name='tradeState'
                                                    id='TradeStateN'
                                                    value='N'
                                                    onChange={handleSaveChange}
                                                />{" "}
                                                No
                                            </label>
                                        </>
                                    )}
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <ManageMentWrapperButtonStyle className='btn_areaC mt30'>
                        {supDetail ? (
                            <>
                                {statusRef.current === "Y" ? (
                                    <>
                                        <ManageMentStyledButton onClick={goUpdateFnc}>수정</ManageMentStyledButton>
                                        <ManageMentStyledButton onClick={goDeleteFnc}>삭제</ManageMentStyledButton>
                                    </>
                                ) : (
                                    <>
                                        <ManageMentStyledButton onClick={goRecoverFnc}>
                                            거래 재개
                                        </ManageMentStyledButton>
                                    </>
                                )}
                            </>
                        ) : (
                            <>
                                <ManageMentStyledButton onClick={goSaveFnc}>저장</ManageMentStyledButton>
                            </>
                        )}
                        {supDetail ? (
                            <ManageMentStyledButton onClick={closeDetailModal}>취소</ManageMentStyledButton>
                        ) : (
                            <ManageMentStyledButton onClick={closeSaveDetailModal}>취소</ManageMentStyledButton>
                        )}
                    </ManageMentWrapperButtonStyle>
                </div>
                {isPostcodeOpen && (
                    <DaumPostcode
                        onComplete={handleAddressSearch} // 주소 선택 완료 시 호출되는 함수
                    />
                )}
            </UserInfoModalStyle>
        </>
    );
};
