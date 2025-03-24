import { useEffect, useRef, useState } from "react";
import { LoginStyled } from "./styled";
import axios from "axios";
import { useRecoilState, useSetRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";
import { loginInfoState } from "../../../stores/userInfo";
import { ILoginInfo } from "../../../models/interface/store/userInfo";
import logo_img from "../../../assets/logo_img.png";
import { JoinModal } from "./Join/JoinModal";
import { modalState } from "../../../stores/modalState";
import { Portal } from "../../common/potal/Portal";
import { FindModal } from "./Find/FindModal";
import Swal from "sweetalert2";
import { deliveryPostApi } from "../../../api/DeliveryApi/postApi";
import { login } from "../../../api/api";

export interface IAccount {
    lgn_Id: string;
    pwd: string;
}

export const LoginMain = () => {
    const setLoginInfo = useSetRecoilState<ILoginInfo>(loginInfoState);
    const [account, setAccount] = useState<IAccount>({
        lgn_Id: "",
        pwd: "",
    });
    const navigate = useNavigate();
    const [modal, setModal] = useRecoilState<boolean>(modalState);
    const [modalFlag, setModalFlag] = useState<String>("");
    const inputRef = useRef<HTMLInputElement | null>(null);
    const inputRef2 = useRef<HTMLInputElement | null>(null);

    const focusInput = (flag: number) => {
        if (inputRef.current) {
            if (flag === 1) {
                setTimeout(() => {
                    inputRef.current.focus();
                }, 330);
            } else {
                setTimeout(() => {
                    inputRef2.current.focus();
                }, 330);
            }
        }
    };
    useEffect(() => {
        if (inputRef.current) {
            focusInput(1);
        }
    }, []);

    const loginHandler = async () => {
        const data = { loginID: account.lgn_Id };
        const result = await deliveryPostApi(login.checkLoginId, data);
        if (result === 0) {
            Swal.fire("아이디가 잘못되었습니다!", "", "warning").then((result) => {
                focusInput(1);
            });
            return;
        }
        const param = new URLSearchParams();
        param.append("lgn_Id", account.lgn_Id);
        param.append("pwd", account.pwd);

        axios.post("/loginProc.do", param).then((res) => {
            const data = res.data;

            if (data.result === "SUCCESS") {
                setLoginInfo(data);
                sessionStorage.setItem("userInfo", JSON.stringify(data));
                navigate("/react");
            } else {
                Swal.fire("비밀번호가 일치하지 않습니다.", "", "warning").then((result) => {
                    focusInput(2);
                });
                return;
            }
        });
    };

    const handleKeyPress = (e) => {
        return e.key === "Enter" ? loginHandler() : null;
    };

    return (
        <LoginStyled>
            <div className='login-container'>
                <div>
                    <div className='login-text'>
                        <div className='login-image'>
                            <img alt='' src={logo_img} />
                        </div>
                        <h3> 안되는 것이 실패가 아니라 포기하는 것이 실패다 </h3>
                        <div>
                            성공은 실패의 꼬리를 물고 온다.지금 포기한 것이 있는가 ?
                            <br />
                            그렇다면 다시 시작해 보자. <br />
                            안되는 것이 실패가 아니라 포기하는 것이 실패다. <br />
                            포기한 순간이 성공하기 5 분전이기 쉽다. <br />
                            실패에서 더 많이 배운다. <br />
                            실패를 반복해서 경험하면 실망하기 쉽다. <br />
                            하지만 포기를 생각해선 안된다.실패는 언제나 중간역이지 종착역은 아니다. <br />
                        </div>
                        <div> -이대희, ‘1 % 의 가능성을 희망으로 바꾼 사람들’ 에서 </div>
                    </div>
                    <div className='login-box'>
                        <div className='buttons inputs'>
                            <div>
                                <label> 아이디 </label>
                                <input
                                    required
                                    onChange={(e) => {
                                        setAccount((prev: IAccount) => {
                                            return { ...prev, lgn_Id: e.target.value };
                                        });
                                    }}
                                    ref={inputRef}
                                />
                            </div>
                            <div>
                                <label> 비밀번호 </label>
                                <input
                                    required
                                    type='password'
                                    onKeyDown={handleKeyPress}
                                    onChange={(e) => {
                                        setAccount((prev: IAccount) => {
                                            return { ...prev, pwd: e.target.value };
                                        });
                                    }}
                                    ref={inputRef2}
                                />
                            </div>
                            <div>
                                <button className='login-button' onClick={loginHandler}>
                                    Login
                                </button>
                                <button
                                    className='signup-button'
                                    onClick={() => {
                                        setModal(!modal);
                                        setModalFlag("Join");
                                    }}
                                >
                                    {" "}
                                    Sign Up{" "}
                                </button>
                                <button
                                    className='findID-button'
                                    onClick={() => {
                                        setModal(!modal);
                                        setModalFlag("Find");
                                    }}
                                >
                                    Find ID/Pwd
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {modal && modalFlag === "Join" && (
                <Portal>
                    <JoinModal />
                </Portal>
            )}
            {modal && modalFlag === "Find" && (
                <Portal>
                    <FindModal />
                </Portal>
            )}
        </LoginStyled>
    );
};
