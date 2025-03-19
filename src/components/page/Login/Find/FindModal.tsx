import { useRecoilState } from "recoil";
import { findModalState } from "../../../../stores/modalState";
import { useEffect, useRef, useState } from "react";
import { JoinStyled } from "../Join/styled";
import { StyledInput } from "../../../common/StyledInput/StyledInput";
import Swal from "sweetalert2";
import { deliveryPostApi } from "../../../../api/DeliveryApi/postApi";
import { login } from "../../../../api/api";
import { IFindFormData, IPostResponse } from "../../../../models/interface/IDelivery";

export const FindModal = () => {
    const [findModal, setFindModal] = useRecoilState<boolean>(findModalState);
    const [findFlag, setFindFlag] = useState<boolean>(true);
    const [emailSendPwd, setEmailSendPwd] = useState<boolean>(false);
    const [emailSendID, setEmailSendID] = useState<boolean>(false);
    const [changePw, setChangePw] = useState<boolean>(false);
    const [authEmailCode, setAuthEmailCode] = useState<string>("");
    const [userID, setUserID] = useState<string>("");
    const [formData, setFormData] = useState<IFindFormData>({
        emailID: "",
        emailPwd: "",
        id: "",
        code: "",
        password: "",
        password1: "",
    });

    const [modalflag, setModalflag] = useState(true);
    const [pwIdCheck, setPwIdCheck] = useState<boolean>(false);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

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
    }, [findFlag]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const registerIdCheck = async () => {
        if (formData.id === "") {
            Swal.fire("아이디를 입력해 주세요", "", "warning").then((result) => {
                focusInput(0);
            });
            return;
        }
        const data = { loginID: formData.id };
        const result: IPostResponse = await deliveryPostApi(login.checkRegisterId, data);
        if (result.result === "SUCCESS") {
            Swal.fire("아이디가 존재합니다", "", "success").then((result) => {
                focusInput(1);
            });
            setPwIdCheck(true);
        } else {
            Swal.fire("아이디가 존재하지 않습니다!", "", "warning").then((result) => {
                focusInput(0);
            });
        }
    };

    const sendPwdEmail = async () => {
        if (formData.emailPwd === "") {
            Swal.fire("이메일을 입력해주세요!", "", "warning").then((result) => {
                focusInput(1);
            });
            return true;
        }

        const data = { email: formData.emailPwd, loginID: formData.id };
        const result: IPostResponse = await deliveryPostApi(login.findInfoPw, data);
        if (result.result === "FALSE") {
            Swal.fire("이메일이 틀렸습니다!", "", "warning").then((result) => {
                focusInput(1);
            });
        } else {
            Swal.fire("해당 이메일로 인증번호를 전송하였습니다.", "", "success").then((result) => {
                focusInput(2);
            });
            setEmailSendPwd(true);
            findMailSendPwd();
        }
    };

    const findMailSendPwd = async () => {
        const data = { emailPwd: formData.id, email: formData.emailPwd, authNumIdPwd: formData.code };
        const result: IPostResponse = await deliveryPostApi(login.sendMail, data);
        setAuthEmailCode(result.authNumId);
    };
    const findMailSendID = async () => {
        const data = { emailPwd: formData.id, email: formData.emailID, authNumIdPwd: formData.code };
        const result: IPostResponse = await deliveryPostApi(login.sendMail, data);
        setAuthEmailCode(result.authNumId);
    };

    const sendCompletePwd = () => {
        if (formData.code === "") {
            Swal.fire("인증번호를 입력해주세요!", "", "warning").then((result) => {
                focusInput(2);
            });
            return;
        } else if (formData.code !== authEmailCode) {
            Swal.fire("인증번호가 틀렸습니다.", "", "warning").then((result) => {
                focusInput(2);
            });
            return;
        } else if (formData.code === authEmailCode) {
            Swal.fire("인증번호가 맞습니다. 비밀번호를 변경합니다.", "", "success").then((result) => {
                focusInput(3);
            });
            setChangePw(true);
        }
    };

    const changePwd = async () => {
        if (formData.password === "") {
            Swal.fire("변경할 비밀번호를 입력하세요.", "", "warning").then((result) => {
                focusInput(3);
            });
            return;
        } else if (formData.password1 === "") {
            Swal.fire("비밀번호 확인을 입력하세요.", "", "warning").then((result) => {
                focusInput(4);
            });
            return;
        }
        const passwordRules = /^.*(?=^.{8,15}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&+=]).*$/;

        if (!passwordRules.test(formData.password)) {
            Swal.fire("비밀번호는 숫자, 영문자, 특수문자 조합으로 8~15자리를 사용해야 합니다.", "", "warning").then(
                (result) => {
                    focusInput(3);
                }
            );
            return;
        } else if (formData.password !== formData.password1) {
            Swal.fire("비밀번호와 비밀번호확인이 맞지 않습니다.", "", "warning").then((result) => {
                focusInput(4);
            });
            return;
        }

        const data = { loginID: formData.id, chPassword: formData.password };
        const result: IPostResponse = await deliveryPostApi(login.changePwd, data);
        if (result.result === "success") {
            Swal.fire("비밀번호 변경 완료!", "", "success");
            setFindModal(!findModal);
        } else {
            Swal.fire("비밀번호 변경 실패", "", "warning");
        }
    };

    const selectFindId = async () => {
        if (formData.emailID === "") {
            Swal.fire("이메일을 입력해주세요!", "", "warning").then((result) => {
                focusInput(0);
            });
            return;
        }

        const data = { email: formData.emailID };
        const result: IPostResponse = await deliveryPostApi(login.findInfoId, data);
        if (result.result === "SUCCESS") {
            setUserID(result.resultModel.loginID);
            findMailSendID();
            Swal.fire("해당 이메일로 인증번호를 전송하였습니다.", "", "success").then((result) => {
                focusInput(1);
            });
            setEmailSendID(true);
        } else {
            Swal.fire("잘못된 이메일을 입력하셨습니다!", "", "warning").then((result) => {
                focusInput(0);
            });
        }
    };

    const findId = () => {
        if (formData.code === "") {
            Swal.fire("인증번호를 입력해주세요!", "", "warning").then((result) => {
                focusInput(1);
            });
            return;
        } else if (formData.code !== authEmailCode) {
            Swal.fire("인증번호가 틀렸습니다.", "", "warning").then((result) => {
                focusInput(1);
            });
            return;
        } else if (formData.code === authEmailCode) {
            setFindModal(!findModal);
            Swal.fire(`귀하의 아이디는 "${userID}" 입니다.`, "", "warning");
        }
    };

    const closeModalWithDelay = () => {
        setModalflag(false);
        setTimeout(() => {
            setFindModal(!findModal);
        }, 200); // 애니메이션 시간(300ms 후에 모달 제거)
    };

    return (
        <JoinStyled>
            <div className={`modal-overlay ${modalflag ? "fade-in" : "fade-out"}`}>
                <div className='container'>
                    {!changePw ? (
                        <>
                            {findFlag ? (
                                <>
                                    <div className='findTitle'>
                                        <strong onClick={() => setFindFlag(true)} style={{ fontSize: "150%" }}>
                                            아이디찾기
                                        </strong>
                                        /
                                        <span className='findTitle' onClick={() => setFindFlag(false)}>
                                            비밀번호찾기
                                        </span>
                                    </div>
                                    <table>
                                        <tr>
                                            <th>
                                                이메일<span className='font_red'>*</span>
                                            </th>
                                            <td>
                                                <StyledInput
                                                    type='text'
                                                    name='emailID'
                                                    value={formData.emailID}
                                                    onChange={handleChange}
                                                    size='small'
                                                    autoComplete='off'
                                                    ref={addInputRef}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type='button'
                                                    value='이메일전송'
                                                    onClick={selectFindId}
                                                    className='findCheckButton'
                                                />
                                            </td>
                                        </tr>
                                        {emailSendID ? (
                                            <tr>
                                                <th>
                                                    인증번호<span className='font_red'>*</span>
                                                </th>
                                                <td>
                                                    <StyledInput
                                                        type='text'
                                                        name='code'
                                                        value={formData.code}
                                                        onChange={handleChange}
                                                        size='small'
                                                        autoComplete='off'
                                                        ref={addInputRef}
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        type='button'
                                                        value='인증하기'
                                                        onClick={findId}
                                                        className='findCheckButton'
                                                    />
                                                </td>
                                            </tr>
                                        ) : (
                                            <></>
                                        )}
                                    </table>
                                </>
                            ) : (
                                <>
                                    <div className='findTitle'>
                                        <span onClick={() => setFindFlag(true)}>아이디찾기</span>/
                                        <strong
                                            className='findTitle'
                                            onClick={() => setFindFlag(false)}
                                            style={{ fontSize: "150%" }}
                                        >
                                            비밀번호찾기
                                        </strong>
                                    </div>
                                    <table>
                                        <tr>
                                            <th>
                                                아이디<span className='font_red'>*</span>
                                            </th>
                                            <td>
                                                <StyledInput
                                                    type='text'
                                                    name='id'
                                                    value={formData.id}
                                                    onChange={handleChange}
                                                    size='small'
                                                    autoComplete='off'
                                                    ref={addInputRef}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type='button'
                                                    value='아이디체크'
                                                    onClick={registerIdCheck}
                                                    className='findCheckButton'
                                                />
                                            </td>
                                        </tr>
                                        {pwIdCheck ? (
                                            <tr>
                                                <th>
                                                    이메일<span className='font_red'>*</span>
                                                </th>
                                                <td>
                                                    <StyledInput
                                                        type='text'
                                                        name='emailPwd'
                                                        value={formData.emailPwd}
                                                        onChange={handleChange}
                                                        size='small'
                                                        autoComplete='off'
                                                        ref={addInputRef}
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        type='button'
                                                        value='이메일전송'
                                                        onClick={sendPwdEmail}
                                                        className='findCheckButton'
                                                    />
                                                </td>
                                            </tr>
                                        ) : (
                                            <></>
                                        )}
                                        {emailSendPwd ? (
                                            <tr>
                                                <th>
                                                    인증번호<span className='font_red'>*</span>
                                                </th>
                                                <td>
                                                    <StyledInput
                                                        type='text'
                                                        name='code'
                                                        value={formData.code}
                                                        onChange={handleChange}
                                                        size='small'
                                                        autoComplete='off'
                                                        ref={addInputRef}
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        type='button'
                                                        value='인증하기'
                                                        onClick={sendCompletePwd}
                                                        className='findCheckButton'
                                                    />
                                                </td>
                                            </tr>
                                        ) : (
                                            <></>
                                        )}
                                    </table>
                                </>
                            )}
                        </>
                    ) : (
                        <table>
                            <tr>
                                <th>
                                    새 비밀번호<span className='font_red'>*</span>
                                </th>
                                <td>
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
                                <th>
                                    비밀번호 확인<span className='font_red'>*</span>
                                </th>
                                <td>
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
                        </table>
                    )}
                    <div className='bottomButtonArea'>
                        {changePw ? <button onClick={changePwd}>비밀번호 변경</button> : <></>}

                        <button style={{ width: "100px" }} onClick={closeModalWithDelay} className='cancelButton'>
                            <span>취소</span>
                        </button>
                    </div>
                </div>
            </div>
        </JoinStyled>
    );
};
