import { UserInfoModalStyle } from "./styled";
import { modalState } from "../../../../../stores/modalState";
import { detailModalState } from "../../../../../stores/modalState";
import { ContentBox } from "../../../../common/ContentBox/ContentBox";
import { StyledInput } from "../../../../common/StyledInput/StyledInput";
import DaumPostcode from "react-daum-postcode";
import { useEffect, useState } from "react";
import { detailCodeListhApi } from "../../../../../api/UserInfoApi/detailCodeListApi";
import { UserInfo } from "../../../../../api/api";
import { useNavigate } from "react-router-dom";
import {
    IDetailCodeListResponse,
    IDuplicUserIdResponse,
    IInsertUserInfoResponse,
} from "../../../../../models/interface/IUserInfo";
import { StyledButton } from "../../../../common/StyledButton/StyledButton";
import { useRef } from "react";
import { duplicUserIdCheckApi } from "../../../../../api/UserInfoApi/duplicUserIdCheckApi";

import axios from "axios";
import { postUserInfoInsertApi } from "../../../../../api/UserInfoApi/postUserInfoInsertApi";
import { userInfo } from "os";
import { ProductsModalStyled } from "../../../Mall/Products/ProductsModal/styled";
import { UserDetailInfoModalProps } from "../../../../../models/interface/IUserInfo";
import { IUserInfoDetailResponse } from "../../../../../models/interface/IUserInfo";
import { FC } from "react";
import { IUserDetialInfo } from "../../../../../models/interface/IUserInfo";
// window.daum 타입 확장
import { useRecoilState } from "recoil";
import { userInfoDetailApi } from "../../../../../api/UserInfoApi/userInfoDetailApi";

export const UserInfoModal: FC<UserDetailInfoModalProps> = ({ isdetail, LoginId }) => {
    console.log("isdetail: " + isdetail);
    //모달 관리
    const [modal, setModal] = useRecoilState(modalState);

    const [detailModal, setDetailModal] = useRecoilState(detailModalState);
    const [userData, setUserData] = useState({
        action: "I",
        user_type: "",
        classType: "",
        statusYn: "",
        group_code: "",
        detail_code: "",
        loginID: "",
        password: "",
        password1: "",
        name: "",
        manager: "",
        hp: "",
        userTel1: "",
        userTel2: "",
        userTel3: "",
        birthday: "",
        user_email: "",
        user_zipcode: "",
        user_address: "",
        user_dt_address: "",
        detailName: "",
    });

    const valiPwdMessage = {
        password: "비밀번호 형식에 맞지 않습니다.",
        password1: "비밀번호 형식에 맞지 않습니다.",
    };

    const valiMessage = {
        password: "비밀번호가 일치하지 않습니다.",
        password1: "비밀번호가 일치하지 않습니다.",
        userTel1: "전화번호 앞자리 형식이 옳바르지 안습니다. \n ex:010, 031, 019",
        userTel2: "전화번호 중간자리 형식이 옳바르지 안습니다. \n ex:3자리에서 4자리",
        userTel3: "전화번호 마지막자리 형식이 옳바르지 안습니다. \n ex:3자리에서 4자리",
    };

    const emptyValiMessage = {
        group_code: "직원 유형을 선택해주세요",
        detailCode: "담당 업무를 선택해주세요",
        detail_code: "담당 업무를 선택해주세요",
        loginID: "아이디를 입력해주세요",
        password: "비번 을 입력해주세요",
        password1: "비번 을 입력해주세요",
        name: "이름/회사명을 입력해주세요",
        manager: "담당자 명을 입력해주세요",
        userTel1: "전화번호 앞자리를 입력해주세요",
        userTel2: "전화번호 중간자리를 입력해주세요",
        userTel3: "전화번호 마지막 자리를 입력해주세요",
        birthday: "생년 월일을 입력해주세요",
        user_email: "이메일을 입력해주세요",
        user_zipcode: "우편번호 찾기를 입력해주세요",
        user_address: "우편번호 찾기를 입력해주세요",
        user_dt_address: "상세주로를 입력해주세요",
    };

    //디테일=> 에러 터치면 IUserDetialInfo 으로 수정
    const [detailInfo, setDetailInfo] = useState<IUserDetialInfo>({
        groupCode: "",
        user_type: "",
        classType: "",
        statusYn: "",
        group_code: "",
        detail_code: "",
        loginID: "",
        password: "",
        password1: "",
        name: "",
        manager: "",
        hp: "",
        userTel1: "",
        userTel2: "",
        userTel3: "",
        birthday: "",
        user_email: "",
        user_zipcode: "",
        user_address: "",
        user_dt_address: "",
        detailCode: "",
        userClass: "",
        sex: "",
        email: "",
        zipCode: "",
        address: "",
        ph: "",
        detailName: "",
        userType: "",
    });

    const [detailCode, setDetailCode] = useState<object>();
    useEffect(() => {
        if (isdetail && LoginId != undefined) {
            x();
        }
        async function x() {
            console.log("서버로넘길 파람" + LoginId);
            const res1: any = await userInfoDetailApi(UserInfo.userInfoDetail, { loginID: LoginId });
            const res2: any = await userInfoDetailApi(UserInfo.detailsearch, { groupCode: res1.detailValue.groupCode });
            // console.log(res.detailValue);
            setDetailInfo(res1.detailValue);
            setDetailCode(res2.detailCode);

            //
            setDetailCodeList(res2.detailCode);
        }
        // setUserDetail(null);
    }, []);

    const [selectedDetailCode, setSelectedDetailCode] = useState(detailInfo?.detailCode);
    const [detailCodeList, setDetailCodeList] = useState<any>();
    //박스
    useEffect(() => {
        if (isdetail) {
            const box: any = { ...detailInfo };
            const box2: any = { ...detailCode };
            var box3 = { ...userData };
            //  console.log(box.detailCode);
            //  console.log(box.group_code);

            console.log(box2);
            for (var key in box2) {
                //console.log(`box2[key].detailCode: ${box2[key].detailCode}   box.detailCode: ${box.detailCode}`);
                if (box2[key].detailCode === box.detailCode) {
                    console.log(`하나를 좀 뽑자 : ${box2[key].detailName}`);
                    box.group_code = box2[key].detailCode;
                    box3.detailName = box2[key].detailName;
                    box.detailName = box2[key].detailCode;
                    // handlerdetailCodeList();
                }
            }

            box.group_code = detailInfo?.groupCode;
            box.gender_cd = detailInfo?.sex;
            box.detail_code = detailInfo?.detailCode;
            box.classType = detailInfo?.userClass;
            box.user_type = detailInfo?.userType;
            box.user_address = detailInfo?.address;
            box.password1 = detailInfo?.password;
            box.group_code = detailInfo?.groupCode;
            box.user_zipcode = detailInfo?.zipCode;
            box.user_email = detailInfo?.email;
            // zipcodeRef.current.value = detailInfo?.zipCode;
            addressRef.current.value = detailInfo?.address;
            if (detailInfo?.hp) {
                const [t1, t2, t3] = detailInfo.hp.split("-");
                box3.userTel1 = t1;
                box3.userTel2 = t2;
                box3.userTel3 = t3;
                setUserData({
                    ...box3,
                    ...box,
                });
            }
            // setSelectedDetailCode(detailInfo?.detailCode);
        }
        // alert(box3.detailName);
        console.log(detailInfo);
    }, [detailInfo]);

    // 유효성을 요하는 변수들 idRef, emailRef
    const idRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);

    const [selectValue, setSelectValue] = useState<string>("선택");

    const [isValid, setIsValid] = useState(true); // 유효성 상태
    const [errorMessage, setErrorMessage] = useState(""); // 오류 메시지
    const birthRef = useRef<HTMLInputElement>(null);
    //다음 우편번호찾기
    const [isDaumLoaded, setIsDaumLoaded] = useState(false);

    useEffect(() => {
        if (selectValue != "선택") {
            console.log("바뀐다.!:   " + selectValue);

            handlerdetailCodeList();
        }
    }, [selectValue]);

    useEffect(() => {
        if (!isdetail && LoginId === undefined) {
            alert("다언디파이니팔");
            handlerdetailCodeList("E10001X1");
        }
    }, []);

    const handlerdetailCodeList = async (defaultValue?: string) => {
        var param;

        if (defaultValue != undefined) {
            param = {
                groupCode: defaultValue,
            };
        } else {
            param = {
                groupCode: selectValue,
            };
        }

        const res: IDetailCodeListResponse = await detailCodeListhApi(UserInfo.detailsearch, param);

        setDetailCodeList(res.detailCode);
    };

    //이벤트가 꼬여 셀렉트 그룹코드 체인지 따로 만듬..
    const handleGroupChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        //  console.log(`네임: ${name}     밸류: ${value}`);

        const box = { ...userData };
        box.group_code = value;

        if (name === "group_code") {
            let label = value; //
            // select 요소인 경우 selectedOptions 사용
            if (e.target instanceof HTMLSelectElement) {
                label = e.target.selectedOptions[0]?.text;
            }
            console.log(label);

            if (label === "SCM 담당자") {
                box.user_type = "S";
                box.classType = "SCM담당자";
            } else if (label === "구매 담당자") {
                box.user_type = "P";
                box.classType = "구매담당자";
            } else if (label === "회사 임원") {
                box.user_type = "E";
                box.classType = "회사임원";
            } else if (label === "배송 담당자") {
                box.user_type = "D";
                box.classType = "배송담당자";
            } else if (label === "기업 고객") {
                box.user_type = "C";
                box.classType = "기업고객";
            }

            setUserData(box);
        }
    };

    const detaileHandleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        //detailInfo
        console.log(`네임: ${name}     밸류: ${value}`);
        setDetailInfo((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        console.log(`네임: ${name}     밸류: ${value}`);

        setUserData((prevData) => ({
            ...prevData,
            [name]: value,
        }));

        if (name === "group_code") {
            let label = value; //
            // select 요소인 경우 selectedOptions 사용
            if (e.target instanceof HTMLSelectElement) {
                label = e.target.selectedOptions[0]?.text;
            }
            console.log(label);
            const box = { ...userData };

            if (label === "SCM 담당자") {
                box.user_type = "S";
                box.classType = "SCM담당자";
            } else if (label === "구매 담당자") {
                box.user_type = "P";
                box.classType = "구매담당자";
            } else if (label === "회사 임원") {
                box.user_type = "E";
                box.classType = "회사임원";
            } else if (label === "배송 담당자") {
                box.user_type = "D";
                box.classType = "배송담당자";
            } else if (label === "기업 고객") {
                box.user_type = "C";
                box.classType = "기업고객";
            }

            setUserData(box);
        }
    };

    const handleChange2 = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        console.log(`네임: ${name}     밸류: ${value}`);
        setUserData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const checkDuplicFnc = async () => {
        const idValiCheck = IdValidateInput(idRef.current.value);

        if (!idValiCheck) {
            setIsValid(false);
            return;
        }
        //loginID:idRef.current.value
        const res: IDuplicUserIdResponse = await duplicUserIdCheckApi(UserInfo.checkDuplicUserId, {
            loginID: idRef.current.value,
        });

        alert(res.duplicCnt);
        if (res.duplicCnt === 0) {
            const box = { ...userData };
            box.loginID = idRef.current.value;
            setUserData(box);
            alert("사용 가능한 아이디 입니다.");
        } else {
            const box = { ...userData };
            box.loginID = "";
            setUserData(box);
            alert("이미 사용중인 아이디 입니다.");
        }

        //false로 해야 아디 또 적을시 이함수가 실행됨
        setIsValid(false);
    };

    const IdValidateInput = (value: string): boolean => {
        // 숫자와 영문자 조합, 5~20자리 또는 영문자만 5~20자리 허용
        const regex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{5,20}$|^[a-zA-Z]{5,20}$/;
        if (!regex.test(value)) {
            setIsValid(false);
            setErrorMessage("숫자와 영문자 조합 또는 영문자만 5~20자리 입력 가능합니다.");
            return false;
        } else {
            setIsValid(true);
            setErrorMessage("사용가능한 아이디 입니다.");
            return true;
        }
    };

    const checkDuplicEmailFnc = async () => {
        const emailVailCheck = EmailValidateInput(emailRef.current.value);
        const box = { ...userData };

        if (!emailVailCheck) {
            box.user_email = "";
            setUserData(box);
            return;
        }

        await axios.post("/check_emailBody.do", { user_email: emailRef.current.value }).then((res) => {
            if (res.data.duplicCnt === 1) {
                alert("이미 존재하는 아이디 입니다.");
                box.user_email = "";
                setUserData(box);
                return;
            }
            box.user_email = emailRef.current.value;
            setUserData(box);
        });
    };

    const EmailValidateInput = (value: string): boolean => {
        const emailRules: RegExp = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
        if (!emailRules.test(value)) {
            alert("이메일 형식을 확인해주세요");

            return false;
        }

        return true;
    };
    // 주소 관련
    const [isPostcodeOpen, setIsPostcodeOpen] = useState(false);
    const zipcodeRef = useRef<HTMLInputElement>(null);
    const addressRef = useRef<HTMLInputElement>(null);
    const dtAddressRef = useRef<HTMLInputElement>(null);

    const handleAddressSelect = (data: any) => {
        let address = data.roadAddress; // 도로명 주소
        if (!address) address = data.jibunAddress; // 지번 주소
        console.log("우편번호: " + data.zonecode);
        console.log("주소: " + address);

        // ref를 이용하여 우편번호와 주소 직접 입력
        if (zipcodeRef.current) zipcodeRef.current.value = data.zonecode; // 우편번호
        if (addressRef.current) addressRef.current.value = address; // 주소
        if (dtAddressRef.current) dtAddressRef.current.value = ""; // 상세주소 초기화

        const box = { ...userData };
        box.user_zipcode = data.zonecode;
        box.user_address = address;
        setUserData(box);
        // 팝업 닫기
        setIsPostcodeOpen(false);
    };

    const validatePassword = () => {
        // 비밀번호 형식: 숫자, 영문자, 특수문자 조합으로 8~15자리
        const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,15}$/;

        console.log(`1차비번 ${userData.password} 2차비번 ${userData.password1}`);

        if (!passwordRegex.test(userData.password)) {
            return false;
        }

        if (!passwordRegex.test(userData.password1)) {
            return false;
        }

        return true;
    };

    const valiLastPassword = () => {
        console.log("첫 비번  " + userData.password);
        console.log("둘 비번  " + userData.password1);

        if (userData.password !== userData.password1) {
            alert("비밀번호가 일치하지 않습니다.");
            return false;
        }
        return true;
    };

    const handleChange3 = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        console.log(`네임: ${name}     밸류: ${value}`);

        setUserData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const validatePhone = (name: string): boolean => {
        // 각 필드의 값 가져오기
        const tell1 = userData.userTel1;
        const tell2 = userData.userTel2;
        const tell3 = userData.userTel3;

        var isValid = false;
        if (name === "userTel1") {
            isValid = tell1?.length === 3 && /^[0-9]{3}$/.test(tell1);
        }
        if (name === "userTel2") {
            isValid = tell2?.length >= 3 && tell2?.length <= 4 && /^[0-9]{3,4}$/.test(tell2);
        }
        if (name === "userTel3") {
            isValid = tell3?.length >= 3 && tell3?.length <= 4 && /^[0-9]{3,4}$/.test(tell3);
        }
        if (isValid) {
            return true;
        } else {
            return false;
        }
    };

    // 마지막제출
    //원작존중 유효성은 막판에 몰아서 검사
    // 단 빈값여부의 유효성과,
    // 형식의 유효성이 있다.
    // 형식의 유효성은 전화번호, 비번
    const updateUserInfo = async () => {
        //먼저 빈값을 검사.
        for (let key in emptyValiMessage) {
            console.log(key + ": " + userData[key]);
        }

        for (let key in emptyValiMessage) {
            console.log(key + ": " + userData[key]);
            if (userData[key] === "" && key != "manager" && key != "user_dt_address") {
                alert(emptyValiMessage[key]);
                return;
            }
        }

        for (let key in valiPwdMessage) {
            console.log("받은 네임값:  " + key);
            if (!validatePassword()) {
                alert(valiPwdMessage[key]);
                return;
            }
        }

        // 특별히 필한 유효성을 검사.
        for (let key in valiMessage) {
            console.log("받은 네임값:  " + key);
            if (!valiSwitch(key)) {
                alert(valiMessage[key]);
                return;
            }
        }

        console.log("---마지막 제출전 데이터 확인-----");
        console.log(userData);

        const res: any = await postUserInfoInsertApi(UserInfo.updateUserInfo, userData);
        if (res.result === "SUCCESS") {
            alert("정보수정에 성공하였습니다.");
        } else {
            alert("잠시후 다시 시도해주세요");
        }
        window.location.href = "/react/management/user-info";
    };

    const insertUserInfo = async () => {
        //먼저 빈값을 검사.
        for (let key in emptyValiMessage) {
            console.log(key + ": " + userData[key]);
        }

        for (let key in emptyValiMessage) {
            console.log(key + ": " + userData[key]);
            if (userData[key] === "" && key != "manager" && key != "user_dt_address") {
                alert(emptyValiMessage[key]);
                return;
            }
        }

        for (let key in valiPwdMessage) {
            console.log("받은 네임값:  " + key);
            if (!validatePassword()) {
                alert(valiPwdMessage[key]);
                return;
            }
        }

        // 특별히 필한 유효성을 검사.
        for (let key in valiMessage) {
            console.log("받은 네임값:  " + key);
            if (!valiSwitch(key)) {
                alert(valiMessage[key]);
                return;
            }
        }

        console.log("---마지막 제출전 데이터 확인-----");
        console.log(userData);

        const res: IInsertUserInfoResponse = await postUserInfoInsertApi(UserInfo.insertUserInfo, userData);
        console.log(res);
        if (res.resultMsg === "가입 요청 완료") {
            alert("정보 삽입에 성공하였습니다.");
        } else {
            alert("잠시후 다시 시도해주세요");
        }
        window.location.href = "/react/management/user-info";
    };

    //특별히 필요한 유효성의 스위치 문이다.
    const valiSwitch = (name: string): boolean => {
        switch (
            true // 항상 true로 설정하고 각 조건을 체크
        ) {
            case name.startsWith("userTe"):
                // 전화번호 유효성 검사 함수 호출
                return validatePhone(name);

            case name.startsWith("password"):
                // 전화번호 유효성 검사 함수 호출
                return valiLastPassword();

            case name.startsWith("password1"):
                // 전화번호 유효성 검사 함수 호출
                return valiLastPassword();

            default:
                return false;
        }
    };

    const [isRecoverModalOpen, setIsRecoverModalOpen] = useState(false); // 삭제 모달 상태
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // 삭제 모달 상태
    const [isRestoreModalOpen, setIsRestoreModalOpen] = useState(false); // 복구 모달 상태
    const [action, setAction] = useState(null); // 예 아니오 응답값

    const openDeleteModal = () => setIsDeleteModalOpen(true); // 삭제 모달 열기
    const closeDeleteModal = () => setIsDeleteModalOpen(false); // 삭제 모달 닫기
    const openRecovereModal = () => setIsRecoverModalOpen(true); // 삭제 모달 열기
    const closeRecoverModal = () => setIsRecoverModalOpen(false); // 삭제 모달 닫기

    const openRestoreModal = () => setIsRestoreModalOpen(true); // 복구 모달 열기
    const closeRestoreModal = () => setIsRestoreModalOpen(false); // 복구 모달 닫기

    const handleDeleteYes = async () => {
        setAction("삭제");
        await axios.post("/management/userDeleteBody.do", { loginID: LoginId }).then((res: any) => {
            if (res.data.result === "success") {
                alert("삭제에 성공하였습니다.");
            } else {
                alert("잠시후 다시 시도해주세요");
            }
            window.location.href = "/react/management/user-info";
        });

        closeDeleteModal();
    };

    const handleDeleteNo = () => {
        setAction("취소");
        closeDeleteModal();
    };

    const handleRestoreYes = async () => {
        setAction("복구");
        await axios.post("/management/userRecoveryBody.do", { loginID: LoginId }).then((res: any) => {
            if (res.data.result === "success") {
                alert("복구에 성공하였습니다.");
            } else {
                alert("잠시후 다시 시도해주세요");
            }
            window.location.href = "/react/management/user-info";
        });
        closeRestoreModal();
    };

    const handleRestoreNo = () => {
        setAction("복구 취소");
        closeRestoreModal();
    };

    return (
        <UserInfoModalStyle>
            {/* 1열 */}
            <div className='container'>
                <table>
                    <colgroup>
                        <col width='14%' />
                        <col width='12%' />
                        <col width='12%' />
                        <col width='12%' />
                        <col width='14%' />
                        <col width='12%' />
                        <col width='12%' />
                        <col width='12%' />
                    </colgroup>
                    <tbody>
                        <tr>
                            <th scope='row' id='group_codeTh'>
                                직원 유형<span className='font_red'>*</span>
                            </th>
                            <td colSpan={3} id='group_code'>
                                <select
                                    name='group_code'
                                    onChange={(e) => {
                                        //  console.log(e.target.selectedOptions[0].text);
                                        setSelectValue(e.target.value);
                                        handleGroupChange(e);
                                    }}
                                    //  defaultValue={selectValue ? selectValue : "c"}
                                    //value={detailInfo?.group_code}
                                >
                                    {isdetail ? (
                                        <>
                                            <option value={"E10001X1"}>SCM 담당자</option>
                                            <option value={"E10001X1"}>구매 담당자</option>
                                            <option value={"E10001X1"}>회사 임원</option>
                                            <option value={"R20001P1"}>배송 담당자</option>
                                            <option value={"G00001A1"}>기업 고객</option>
                                        </>
                                    ) : (
                                        <>
                                            <option value={"c"}>선택</option>
                                            <option value={"E10001X1"}>SCM 담당자</option>
                                            <option value={"E10001X1"}>구매 담당자</option>
                                            <option value={"E10001X1"}>회사 임원</option>
                                            <option value={"R20001P1"}>배송 담당자</option>
                                            <option value={"G00001A1"}>기업 고객</option>
                                        </>
                                    )}
                                </select>
                            </td>
                            <th scope='row' id='detail_codeTh'>
                                담당 업무<span className='font_red'>*</span>
                            </th>
                            {/* 두번째셀렉트 */}
                            <td colSpan={3} id='detail_code'>
                                {isdetail ? (
                                    <>
                                        <select
                                            name='detailCode'
                                            value={detailInfo?.detailCode}
                                            onChange={detaileHandleChange}
                                        >
                                            {/* {isdetail ? (
                                       <option value={detailInfo?.detailCode}>{detailInfo?.detailName}</option>
                                    ) : (
                                        <option value={"c"}>선택</option>
                                    )} */}
                                            {/* <option value={"c"}>선택</option> */}
                                            {detailCodeList ? (
                                                detailCodeList.map((ele: any, idx: number) => {
                                                    // console.log(ele);
                                                    return (
                                                        <option key={ele.detailCode + idx} value={ele.detailCode}>
                                                            {ele.detailName}
                                                        </option>
                                                    );
                                                })
                                            ) : (
                                                <></>
                                            )}
                                        </select>
                                    </>
                                ) : (
                                    <>
                                        <select name='detail_code' onChange={handleChange}>
                                            <option value={"c"}>선택</option>
                                            {detailCodeList ? (
                                                detailCodeList.map((ele: any, idx: number) => {
                                                    // console.log(ele);
                                                    return (
                                                        <option key={ele.detailCode + idx} value={ele.detailCode}>
                                                            {ele.detailName}
                                                        </option>
                                                    );
                                                })
                                            ) : (
                                                <></>
                                            )}
                                        </select>
                                    </>
                                )}
                            </td>
                        </tr>

                        <tr>
                            <th scope='row'>
                                아이디<span className='font_red'>*</span>
                            </th>
                            <td colSpan={2}>
                                {isdetail ? (
                                    <>
                                        <StyledInput
                                            placeholder='숫자, 영문자 조합으로 6~20자리'
                                            readOnly
                                            value={detailInfo?.loginID}
                                        />
                                    </>
                                ) : (
                                    <>
                                        <StyledInput placeholder='숫자, 영문자 조합으로 6~20자리' ref={idRef} />
                                    </>
                                )}

                                {isValid ? errorMessage : errorMessage}
                            </td>
                            <td colSpan={1}>
                                {!isdetail && <StyledButton onClick={checkDuplicFnc}>중복확인</StyledButton>}
                            </td>
                            <th scope='row'>
                                비밀번호 <span className='font_red'>*</span>
                            </th>
                            <td colSpan={3}>
                                {isdetail ? (
                                    <StyledInput
                                        name='password'
                                        value={detailInfo?.password}
                                        onChange={handleChange2}
                                        placeholder='숫자, 영문자, 특수문자 조합으로 8~15자리 '
                                    />
                                ) : (
                                    <StyledInput
                                        name='password'
                                        onChange={handleChange2}
                                        placeholder='숫자, 영문자, 특수문자 조합으로 8~15자리 '
                                    />
                                )}
                            </td>
                        </tr>
                        {/* 3행 시작 */}
                        <tr>
                            <th scope='row' id='registerName_th'>
                                이름/회사명 <span className='font_red'>*</span>
                            </th>
                            <td colSpan={3}>
                                {isdetail ? (
                                    <StyledInput name='name' value={detailInfo?.name} onChange={detaileHandleChange} />
                                ) : (
                                    <StyledInput name='name' onChange={handleChange} />
                                )}
                            </td>
                            <th scope='row'>
                                비밀번호 확인<span className='font_red'>*</span>
                            </th>
                            <td colSpan={3}>
                                {isdetail ? (
                                    <StyledInput
                                        name='password1'
                                        value={detailInfo?.password}
                                        onChange={handleChange2}
                                        placeholder='숫자, 영문자, 특수문자 조합으로 8~15자리 '
                                    />
                                ) : (
                                    <StyledInput
                                        name='password1'
                                        onChange={handleChange2}
                                        placeholder='숫자, 영문자, 특수문자 조합으로 8~15자리 '
                                    />
                                )}
                            </td>
                        </tr>
                        {/* 4행 시작 */}
                        <tr>
                            <th scope='row' id='registerManager_th'>
                                담당자명
                            </th>
                            <td colSpan={3}>
                                {isdetail ? (
                                    <StyledInput
                                        name='manager'
                                        value={detailInfo?.manager}
                                        onChange={handleChange}
                                        readOnly
                                    />
                                ) : (
                                    <StyledInput name='manager' onChange={handleChange} readOnly />
                                )}
                            </td>
                            <th scope='row'>
                                전화번호<span className='font_red'>*</span>
                            </th>
                            <td colSpan={3}>
                                {isdetail ? (
                                    <>
                                        <StyledInput
                                            style={{ width: "20%" }}
                                            maxLength={3}
                                            type='text'
                                            id='tel1'
                                            name='userTel1'
                                            value={userData.userTel1}
                                            onChange={handleChange3}
                                        />
                                        -
                                        <StyledInput
                                            style={{ width: "20%" }}
                                            maxLength={4}
                                            type='text'
                                            id='tel2'
                                            name='userTel2'
                                            value={userData.userTel2}
                                            onChange={handleChange3}
                                        />
                                        -
                                        <StyledInput
                                            style={{ width: "20%" }}
                                            maxLength={4}
                                            type='text'
                                            id='tel3'
                                            name='userTel3'
                                            value={userData.userTel3}
                                            onChange={handleChange3}
                                        />
                                    </>
                                ) : (
                                    <>
                                        <StyledInput
                                            style={{ width: "20%" }}
                                            maxLength={3}
                                            type='text'
                                            id='tel1'
                                            name='userTel1'
                                            onChange={handleChange3}
                                        />
                                        -
                                        <StyledInput
                                            style={{ width: "20%" }}
                                            maxLength={4}
                                            type='text'
                                            id='tel2'
                                            name='userTel2'
                                            onChange={handleChange3}
                                        />
                                        -
                                        <StyledInput
                                            style={{ width: "20%" }}
                                            maxLength={4}
                                            type='text'
                                            id='tel3'
                                            name='userTel3'
                                            onChange={handleChange3}
                                        />
                                    </>
                                )}
                            </td>
                        </tr>
                        {/* 5
                        행 시작 */}
                        <tr>
                            <th scope='row' id='rggender_th'>
                                성별<span className='font_red'>*</span>
                            </th>
                            <td colSpan={3} id='rggender_td'>
                                {isdetail ? (
                                    <select name='sex' value={detailInfo?.sex} onChange={detaileHandleChange}>
                                        <option value=''>선택</option>
                                        <option value='1'>남자</option>
                                        <option value='2'>여자</option>
                                    </select>
                                ) : (
                                    <select name='sex' onChange={handleChange}>
                                        <option value=''>선택</option>
                                        <option value='1'>남자</option>
                                        <option value='2'>여자</option>
                                    </select>
                                )}
                            </td>
                            <th scope='row' id='birthday1'>
                                생년월일 <span className='font_red'>*</span>
                            </th>
                            <td colSpan={3}>
                                {isdetail ? (
                                    <StyledInput
                                        name='birthday'
                                        type='date'
                                        value={detailInfo?.birthday}
                                        onChange={detaileHandleChange}
                                    />
                                ) : (
                                    <StyledInput name='birthday' type='date' onChange={handleChange2} />
                                )}
                            </td>
                        </tr>

                        {/* 6
                        행 시작 */}
                        <tr>
                            <th scope='row'>
                                이메일<span className='font_red'>*</span>
                            </th>
                            <td colSpan={6}>
                                {isdetail ? (
                                    <StyledInput
                                        name='email'
                                        value={detailInfo?.email}
                                        onChange={detaileHandleChange}
                                    ></StyledInput>
                                ) : (
                                    <StyledInput ref={emailRef}></StyledInput>
                                )}
                            </td>
                            <td colSpan={1}>
                                <StyledButton onClick={checkDuplicEmailFnc}>중복확인</StyledButton>
                            </td>
                        </tr>

                        {/*7행 시작*/}
                        <tr>
                            <th scope='row'>
                                우편번호<span className='font_red'>*</span>
                            </th>
                            <td colSpan={6}>
                                {isdetail ? (
                                    <StyledInput value={detailInfo?.zipCode} />
                                ) : (
                                    <StyledInput ref={zipcodeRef} readOnly />
                                )}
                            </td>

                            <td colSpan={1}>
                                <StyledButton onClick={() => setIsPostcodeOpen(true)}>우편번호 찾기</StyledButton>
                            </td>
                        </tr>
                        {/*8행 시작*/}
                        <tr>
                            <th scope='row'>
                                주소<span className='font_red'>*</span>
                            </th>
                            <td colSpan={8}>
                                {isdetail ? (
                                    <StyledInput ref={addressRef} readOnly />
                                ) : (
                                    <StyledInput ref={addressRef} readOnly />
                                )}
                            </td>
                        </tr>
                        {/*9행 시작*/}
                        <tr>
                            <th scope='row'>상세주소</th>
                            <td colSpan={8}>
                                <StyledInput name='user_dt_address' ref={dtAddressRef} onChange={handleChange} />
                                {isPostcodeOpen && (
                                    <DaumPostcode
                                        onComplete={handleAddressSelect} // 주소 선택 완료 시 호출되는 함수
                                    />
                                )}
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div className='btnArea'>
                    {/* <StyledButton size={"small"} onClick={insertUserInfo}>
                        등록
                    </StyledButton> */}
                    {isdetail ? (
                        <>
                            <StyledButton size={"small"} onClick={updateUserInfo}>
                                수정
                            </StyledButton>

                            {detailInfo?.statusYn === "1" ? (
                                <>
                                    <StyledButton size={"small"} onClick={openDeleteModal}>
                                        삭제
                                    </StyledButton>
                                </>
                            ) : (
                                <>
                                    <StyledButton size={"small"} onClick={openRestoreModal}>
                                        복구
                                    </StyledButton>
                                </>
                            )}

                            <StyledButton
                                size={"small"}
                                onClick={() => {
                                    setDetailModal(!detailModal);
                                }}
                            >
                                취소
                            </StyledButton>
                        </>
                    ) : (
                        <>
                            <StyledButton size={"small"} onClick={insertUserInfo}>
                                등록
                            </StyledButton>
                            <StyledButton
                                size={"small"}
                                onClick={() => {
                                    setModal(!modal);
                                }}
                            >
                                취소
                            </StyledButton>
                        </>
                    )}
                </div>
            </div>
            {isDeleteModalOpen && (
                <div style={modalStyles}>
                    <div style={modalContentStyles}>
                        <h2>정말로 삭제하시겠습니까?</h2>
                        <button onClick={handleDeleteYes}>예</button>
                        <button onClick={handleDeleteNo}>아니요</button>
                        <button onClick={closeDeleteModal}>닫기</button>
                    </div>
                </div>
            )}

            {isRestoreModalOpen && (
                <div style={modalStyles}>
                    <div style={modalContentStyles}>
                        <h2>복구하시겠습니까?</h2>
                        <button onClick={handleRestoreYes}>예</button>
                        <button onClick={handleRestoreNo}>아니요</button>
                        <button onClick={closeRestoreModal}>닫기</button>
                    </div>
                </div>
            )}
            {isRecoverModalOpen && (
                <div style={modalStyles}>
                    <div style={modalContentStyles}>
                        <h2>복구하시겠습니까?</h2>
                        <button onClick={handleRestoreYes}>예</button>
                        <button onClick={handleRestoreNo}>아니요</button>
                        <button onClick={closeRestoreModal}>닫기</button>
                    </div>
                </div>
            )}
        </UserInfoModalStyle>
    );
};
// CSSProperties를 사용하여 타입을 지정
const modalStyles: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
};

const modalContentStyles: React.CSSProperties = {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "5px",
    textAlign: "center",
};
