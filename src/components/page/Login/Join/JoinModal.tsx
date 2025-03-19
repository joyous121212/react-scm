import { useEffect, useRef, useState } from "react";
import { useRecoilState } from "recoil";
import { modalState } from "../../../../stores/modalState";
import axios, { AxiosResponse } from "axios";
import { JoinStyled } from "./styled";
import { StyledInput } from "../../../common/StyledInput/StyledInput";
import DaumPostcodeEmbed from "react-daum-postcode";
import { IJoinFormData } from "../../../../models/interface/IDelivery";
import Swal from "sweetalert2";
import { deliveryPostApi } from "../../../../api/DeliveryApi/postApi";
import { login } from "../../../../api/api";

type IJoinPostResponse = number;

export const JoinModal = () => {
    const [modal, setModal] = useRecoilState<boolean>(modalState);
    const [modalflag, setModalflag] = useState(true);

    const [formData, setFormData] = useState<IJoinFormData>({
        action: "I",
        user_type: "C",
        group_code: "G00001A1",
        detail_code: "GB0000T13",
        classType: "기업고객",
        loginID: "",
        password: "",
        password1: "",
        name: "",
        manager: "",
        userTel1: "",
        userTel2: "",
        userTel3: "",
        gender_cd: "",
        birthday: "",
        user_email: "",
        user_zipcode: "",
        user_address: "",
        user_dt_address: "",
        hp: "",
    });
    const [ckIdcheckreg, setCkIdcheckreg] = useState<number>(0);
    const [ckEmailcheckreg, setCkEmailcheckreg] = useState<number>(0);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // input을 refs 배열에 추가하는 함수
    const addInputRef = (el: HTMLInputElement | null) => {
        if (el && !inputRefs.current.includes(el)) {
            inputRefs.current.push(el);
        }
    };

    const focusInput = (index: number) => {
        if (inputRefs.current[index]) {
            setTimeout(() => {
                inputRefs.current[index].focus();
            }, 330);
        }
    };

    useEffect(() => {
        if (inputRefs.current[0]) {
            focusInput(0);
        }
    }, []);

    const checkNotEmpty = (): boolean => {
        const fields = [
            { id: "loginID", message: "아이디를 입력해 주세요." },
            { id: "password", message: "비밀번호를 입력해 주세요." },
            { id: "password1", message: "비밀번호 확인을 입력해 주세요." },
            { id: "name", message: "회사명을 입력해 주세요." },
            { id: "manager", message: "담당자명을 입력해 주세요." },
            { id: "userTel1", message: "전화번호를 입력해 주세요." },
            { id: "userTel2", message: "전화번호를 입력해 주세요." },
            { id: "userTel3", message: "전화번호를 입력해 주세요." },
            { id: "gender_cd", message: "성별을 입력해 주세요." },
            { id: "birthday", message: "생년월일을 입력해 주세요." },
            { id: "user_email", message: "이메일을 입력해 주세요." },
            { id: "user_zipcode", message: "주소를 입력해 주세요." },
            { id: "user_address", message: "주소를 입력해 주세요." },
        ];

        // 필드를 순차적으로 검사
        for (let i = 0; i < fields.length; i++) {
            const { id, message } = fields[i];
            if (!formData[id as keyof typeof formData] || formData[id as keyof typeof formData].trim() === "") {
                Swal.fire(message, "", "warning").then((result) => {
                    if (i < 8) {
                        focusInput(i);
                    } else if (i > 8) {
                        focusInput(i - 1);
                    }
                });
                return false; // 첫 번째로 발견된 공백에서 종료
            }
        }
        return true; // 모든 필드가 채워져 있으면 true 반환
    };

    const loginIdCheck = async (e) => {
        e.preventDefault();
        const idRules = /^[a-z0-9]{6,20}$/g;
        const id = formData.loginID;
        const data = { loginID: id };

        if (id === "") {
            Swal.fire("ID를 입력해 주세요", "", "warning").then((result) => {
                focusInput(0);
            });
            return;
        } else if (!idRules.test(formData.loginID)) {
            Swal.fire("ID는 숫자, 영문자 조합으로 6~20자리를 사용해야 합니다.", "", "warning").then((result) => {
                focusInput(0);
            });
            return;
        }

        const result = await deliveryPostApi(login.checkLoginId, data);
        if (result === 1) {
            Swal.fire("중복된 아이디가 존재합니다!", "", "warning").then((result) => {
                focusInput(0);
            });
        } else {
            Swal.fire("사용할 수 있는 아이디입니다.", "", "success").then((result) => {
                focusInput(1);
            });
            setCkIdcheckreg(1);
        }
    };

    const emailCheck = async () => {
        const emailRules = /^[0-9a-zA-Z]([-_\\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;

        if (!emailRules.test(formData.user_email)) {
            Swal.fire("이메일 형식을 확인해 주세요!", "", "warning").then((result) => {
                focusInput(9);
            });
            return;
        }
        const data = { email: formData.user_email };
        const result = await deliveryPostApi(login.checkEmail, data);
        if (result === 1) {
            Swal.fire("중복된 이메일이 존재합니다!", "", "warning").then((result) => {
                focusInput(9);
            });
            return;
        } else {
            Swal.fire("사용 가능한 이메일입니다.", "", "success");
            setCkEmailcheckreg(1);
        }
    };

    const execDaumPostcode = () => {
        new window.daum.Postcode({
            oncomplete: function (data: any) {
                // 도로명 주소 및 참고 항목 처리
                const roadAddr = data.roadAddress;
                let extraRoadAddr = "";

                // 법정동명이 있을 경우 추가
                if (data.bname && /[동|로|가]$/g.test(data.bname)) {
                    extraRoadAddr += data.bname;
                }

                // 건물명이 있고, 공동주택일 경우 추가
                if (data.buildingName && data.apartment === "Y") {
                    extraRoadAddr += extraRoadAddr !== "" ? `, ${data.buildingName}` : data.buildingName;
                }

                // 최종적으로 참고 항목 처리
                if (extraRoadAddr) {
                    extraRoadAddr = ` (${extraRoadAddr})`;
                }

                setFormData((prevState) => ({
                    ...prevState,
                    user_zipcode: data.zonecode,
                    user_address: roadAddr || data.jibunAddress,
                }));
            },
        }).open();
    };

    const CompleteRegister = () => {
        if (!checkNotEmpty()) {
            return;
        }

        const idRules = /^[a-z0-9]{6,20}$/g;
        const emailRules = /^[0-9a-zA-Z]([-_\\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
        const passwordRules = /^.*(?=^.{8,15}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&+=]).*$/;
        const tel1Rules = /^\d{2,3}$/;
        const tel2Rules = /^\d{3,4}$/;
        const tel3Rules = /^\d{4}$/;

        if (ckIdcheckreg === 0) {
            Swal.fire("아이디 중복체크를 진행해 주세요!", "", "warning");
            return;
        } else if (!passwordRules.test(formData.password)) {
            Swal.fire("비밀 번호는 숫자,영문자,특수문자 조합으로 8~15자리를 사용해야 합니다.", "", "warning").then(
                (result) => {
                    focusInput(1);
                }
            );
            return;
        } else if (formData.password !== formData.password1) {
            Swal.fire("비밀번호와 비밀번호확인이 일치하지 않습니다.", "", "warning").then((result) => {
                focusInput(2);
            });
            return;
        } else if (!tel1Rules.test(formData.userTel1)) {
            Swal.fire("첫번째 전화번호를 확인해주세요.(숫자만가능)", "", "warning");
            return;
        } else if (!tel2Rules.test(formData.userTel2)) {
            Swal.fire("두번째 전화번호를 확인해주세요.(숫자만가능)", "", "warning");
            return;
        } else if (!tel3Rules.test(formData.userTel3)) {
            Swal.fire("세번째 전화번호를 확인해주세요.(숫자만가능)", "", "warning");
            return;
        } else if (ckEmailcheckreg === 0) {
            Swal.fire("이메일 중복체크를 진행해 주세요!", "", "warning");
            return;
        }
        const hp = formData.userTel1 + "-" + formData.userTel2 + "-" + formData.userTel3;
        setFormData((prevState) => {
            const newFormData = {
                ...prevState,
                hp: hp, // 새로운 hp 값을 추가
            };

            const params = new URLSearchParams();
            // formData 객체의 모든 키-값을 URLSearchParams에 추가
            Object.keys(newFormData).forEach((key) => {
                if (newFormData[key]) {
                    params.append(key, newFormData[key]);
                }
            });
            const param = params.toString();
            axios.post("registerScm.do", param);

            alert("회원가입 완료");
            Swal.fire("회원가입 완료", "", "success");
            // setModal(!modal);
            closeModalWithDelay();

            return newFormData;
        });
    };

    const closeModalWithDelay = () => {
        setModalflag(false);
        setTimeout(() => {
            setModal(!modal);
        }, 200);
    };

    return (
        <JoinStyled>
            <div className={`modal-overlay ${modalflag ? "fade-in" : "fade-out"}`}>
                <div className='container'>
                    <dl>
                        <dt className='signtitle'>
                            <strong>기업 회원가입</strong>
                        </dt>
                        <dd className='content' style={{ width: "89%" }}>
                            <table className='row'>
                                <tbody>
                                    <tr>
                                        <th scope='row'>
                                            아이디<span className='font_red'>*</span>
                                        </th>
                                        <td colSpan={3}>
                                            <StyledInput
                                                type='text'
                                                name='loginID'
                                                placeholder='숫자, 영문자 조합으로 6~20자리'
                                                value={formData.loginID}
                                                onChange={handleChange}
                                                size='password'
                                                autoComplete='off'
                                                ref={addInputRef}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type='button'
                                                value='중복확인'
                                                onClick={loginIdCheck}
                                                className='checkButton'
                                            />
                                        </td>
                                    </tr>

                                    <tr>
                                        <th scope='row'>
                                            비밀번호 <span className='font_red'>*</span>
                                        </th>
                                        <td colSpan={4}>
                                            <StyledInput
                                                type='password'
                                                name='password'
                                                placeholder='숫자, 영문자, 특수문자 조합으로 8~15자리'
                                                value={formData.password}
                                                onChange={handleChange}
                                                size='password'
                                                ref={addInputRef}
                                            />
                                        </td>
                                    </tr>

                                    <tr>
                                        <th scope='row'>
                                            비밀번호 확인<span className='font_red'>*</span>
                                        </th>
                                        <td colSpan={4}>
                                            <StyledInput
                                                type='password'
                                                name='password1'
                                                placeholder='숫자, 영문자, 특수문자 조합으로 8~15자리'
                                                value={formData.password1}
                                                onChange={handleChange}
                                                size='password'
                                                ref={addInputRef}
                                            />
                                        </td>
                                    </tr>

                                    <tr>
                                        <th scope='row'>
                                            회사명 <span className='font_red'>*</span>
                                        </th>
                                        <td colSpan={4}>
                                            <StyledInput
                                                type='text'
                                                name='name'
                                                value={formData.name}
                                                onChange={handleChange}
                                                size='password'
                                                ref={addInputRef}
                                            />
                                        </td>
                                    </tr>

                                    <tr>
                                        <th scope='row'>
                                            담당자명 <span className='font_red'>*</span>
                                        </th>
                                        <td colSpan={4}>
                                            <StyledInput
                                                type='text'
                                                name='manager'
                                                value={formData.manager}
                                                onChange={handleChange}
                                                size='password'
                                                ref={addInputRef}
                                            />
                                        </td>
                                    </tr>

                                    <tr>
                                        <th scope='row'>
                                            전화번호<span className='font_red'>*</span>
                                        </th>
                                        <td colSpan={4}>
                                            <StyledInput
                                                type='text'
                                                name='userTel1'
                                                value={formData.userTel1}
                                                onChange={handleChange}
                                                size='tiny'
                                                maxLength={3}
                                                ref={addInputRef}
                                            />{" "}
                                            -{" "}
                                            <StyledInput
                                                type='text'
                                                name='userTel2'
                                                value={formData.userTel2}
                                                onChange={handleChange}
                                                size='tiny'
                                                maxLength={4}
                                                ref={addInputRef}
                                            />{" "}
                                            -{" "}
                                            <StyledInput
                                                type='text'
                                                name='userTel3'
                                                value={formData.userTel3}
                                                onChange={handleChange}
                                                size='tiny'
                                                maxLength={4}
                                                ref={addInputRef}
                                            />
                                        </td>
                                    </tr>

                                    <tr>
                                        <th scope='row'>
                                            성별<span className='font_red'>*</span>
                                        </th>
                                        <td colSpan={4}>
                                            <select name='gender_cd' value={formData.gender_cd} onChange={handleChange}>
                                                <option value=''>선택</option>
                                                <option value='1'>남자</option>
                                                <option value='2'>여자</option>
                                            </select>
                                        </td>
                                    </tr>

                                    <tr>
                                        <th scope='row'>
                                            생년월일 <span className='font_red'>*</span>
                                        </th>
                                        <td colSpan={4}>
                                            <input
                                                type='date'
                                                className='joinDate'
                                                name='birthday'
                                                value={formData.birthday}
                                                onChange={handleChange}
                                                ref={addInputRef}
                                            />
                                        </td>
                                    </tr>

                                    <tr>
                                        <th scope='row'>
                                            이메일<span className='font_red'>*</span>
                                        </th>
                                        <td colSpan={3}>
                                            <StyledInput
                                                type='text'
                                                name='user_email'
                                                value={formData.user_email}
                                                placeholder='happyjob@happyjop.com'
                                                onChange={handleChange}
                                                size='small'
                                                fullWidth
                                                autoComplete='off'
                                                ref={addInputRef}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type='button'
                                                value='중복확인'
                                                onClick={emailCheck}
                                                className='checkButton'
                                            />
                                        </td>
                                    </tr>

                                    <tr>
                                        <th scope='row'>
                                            우편번호<span className='font_red'>*</span>
                                        </th>
                                        <td colSpan={3}>
                                            <StyledInput
                                                type='text'
                                                name='user_zipcode'
                                                value={formData.user_zipcode}
                                                onChange={handleChange}
                                                size='small'
                                                fullWidth
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type='button'
                                                value='우편번호 찾기'
                                                onClick={execDaumPostcode}
                                                className='checkButton'
                                            />
                                        </td>
                                    </tr>

                                    <tr>
                                        <th scope='row'>
                                            주소<span className='font_red'>*</span>
                                        </th>
                                        <td colSpan={4}>
                                            <StyledInput
                                                type='text'
                                                name='user_address'
                                                value={formData.user_address}
                                                onChange={handleChange}
                                                size='password'
                                            />
                                        </td>
                                    </tr>

                                    <tr>
                                        <th scope='row'>상세주소</th>
                                        <td colSpan={4}>
                                            <StyledInput
                                                type='text'
                                                name='user_dt_address'
                                                value={formData.user_dt_address}
                                                onChange={handleChange}
                                                size='password'
                                            />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                            <div className='btn_areaC mt30 button-container'>
                                <button className='btnType blue' onClick={CompleteRegister}>
                                    <span>회원가입 완료</span>
                                </button>
                                <button className='cancelButton' onClick={closeModalWithDelay}>
                                    <span>취소</span>
                                </button>
                            </div>
                        </dd>
                    </dl>
                </div>
            </div>
        </JoinStyled>
    );
};
