import DaumPostcode from "react-daum-postcode";
import { AxiosResponse } from "axios";
import { UserInfoModalStyle } from "../../UserInfo/UserInfoModal/styled"
import { FC, useEffect, useState } from "react";
import { IDeleteSupplyDetailRespose, IRecoverSupplyDetailRespose, ISupplierInfoDetailResponse, IUpdateSupplyDetailRespose } from "../../../../../models/interface/SupplierInfo";
import { ISupplierInfoDetailDto } from "../../../../../models/interface/SupplierInfo";
import { searchSupplyDetailApi } from "../../../../../api/SupplierInfoApi/searchSupplyDetailApi";
import { StyledButton } from "../../../../common/StyledButton/StyledButton";
import { useRecoilState } from "recoil";
import { detailModalState } from "../../../../../stores/modalState";
import { ISupplierInfoDetailRequestDto } from "../../../../../models/interface/SupplierInfo";

import { postUpdateSupplyDetail } from "../../../../../api/SupplierInfoApi/postUpdateSupplyDetail";
import { SupplierInfo } from "../../../../../api/api";


export interface SupplierDetailInfoModalProps {
	supplyId?: string;
	detailModal?: boolean; // 프롭 타입 설정
	// setUserDetail: React.Dispatch<React.SetStateAction<any>>;
}
import { ISupplierInfoDetail } from "../../../../../models/interface/SupplierInfo";
import { StyledInput } from "../../../../common/StyledInput/StyledInput";
import { Portal } from "../../../../common/potal/Portal";
import { useRef } from "react";
import { postDeleteSupplyDetail } from "../../../../../api/SupplierInfoApi/postDeleteSupplyDetail";

const emptyMessage = {
	//supplyId:string;
	name: "납품업체명은 필수입력 사항입니다.",
	manager: "담당자는 필수입력 사항입니다.",
	phone: "연락쳐는 필수입력 사항입니다.",
	ZipCode: "우편번호는 필수입력 사항입니다.",
	address: "우편번번호 버튼 클릭후 선택해주세요",
	password: "비밀번호는 필수입력 사항 입니다.",
}
//업데이트 시는 또 아이디는 수정 불가라 살짝 다르다. 즉 전화번호만
const upDateValiMessage = {
	phone: "전화번호 형식에 맞지 않습니다.\n ex)하이픈 있던없던[3자리]-[3~4자리]-[3~4자리] (o) "
}





export const SupplierInfoModal: FC<SupplierDetailInfoModalProps> = ({ supplyId }) => {



	const [isPostcodeOpen, setIsPostcodeOpen] = useState(false);


	const [detailModal, setDetailModal] = useRecoilState(detailModalState);

	const phRef = useRef<string>("");

	const [supDetail, setSupDetail] = useState<ISupplierInfoDetail>();





	const request: ISupplierInfoDetailRequestDto = {
		toRequestDto: {
			supply_id: "",
			name: "",
			manager: "",
			phone: "",
			Zip_code: "",
			address: "",
			detail_address: "",
			loginID: "",
			password: "",
			group_code: "",
			create_by: "",
			created_date: "",
			trade_state: ""
		}
	}
	

	// 상세모달 정보를 보기위한 useEffect
	useEffect(() => {
		console.log(supDetail?.ZipCode)
	}, [supDetail])





	// 상세모달 정보를 보기위한 useEffect
	useEffect(() => {
		if (supplyId != undefined) {
			console.log(supplyId)
			justCallFnc()
		}
		async function justCallFnc() {
			console.log(supplyId)
			const res: ISupplierInfoDetailResponse = await searchSupplyDetailApi(SupplierInfo.searchSupplyDetail, { supplyId: supplyId })
			setSupDetail(res.detailValue)


		}
	}, [supplyId])

	const closeDetailModal = () => {
		setDetailModal(!detailModal);
	}

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

		const res:IUpdateSupplyDetailRespose=  await postUpdateSupplyDetail(SupplierInfo.updateSupplyDetail,supDetail);

			if(res.result==="success"){
				alert("정보 수정에 성공하였습니다.");
				//window.location.href = "/react/management/supplier-info";
			}else{
				alert("잠시후 다시 시도해주세요");
			//	window.location.href = "/react/management/supplier-info";
			}


	}

	const goDeleteFnc = async () => {

		const res: IDeleteSupplyDetailRespose = await postDeleteSupplyDetail(SupplierInfo.deleteSupplyDetail, { supplyId: supDetail.supplyId })

		if (res.result === "success") {
			alert("비활성화에 성공하였습니다.");
			window.location.href = "/react/management/supplier-info";
		} else {
			alert("잠시후 다시 시도해주세요");
			window.location.href = "/react/management/supplier-info";
		}

	}

	const goRecoverFnc = async () => {
		const res: IRecoverSupplyDetailRespose = await postDeleteSupplyDetail(SupplierInfo.deleteSupplyDetail, { supplyId: supDetail.supplyId })

		if (res.result === "success") {
			alert("비활성화에 성공하였습니다.");
			window.location.href = "/react/management/supplier-info";
		} else {
			alert("잠시후 다시 시도해주세요");
			window.location.href = "/react/management/supplier-info";
		}
	}


	const emptyCheck = (supDetail): boolean => {

		for (var key in emptyMessage) {
			if (supDetail[key] === "") {
				alert(emptyMessage[key]);
				return false;
			}
		}

		return true;

	}

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
		//alert(value)
		// 하이픈을 제외한 숫자만 추출
		const cleanPhoneNumber = value.replace(/\D/g, '');

		// 10자리 또는 11자리 숫자만 허용
		if (cleanPhoneNumber.length !== 10 && cleanPhoneNumber.length !== 11) {
			return false; // 길이가 맞지 않으면 false 반환
		}

		// 하이픈을 포함한 전화번호 포맷으로 변환
		const formattedPhoneNumber = cleanPhoneNumber.replace(/^(\d{3})(\d{4})(\d{4})$/, '$1-$2-$3');

		// 하이픈 포함 전화번호 형식이 맞는지 체크
		const phoneRegex = /^(01[0-9])-(\d{3,4})-(\d{4})$/;

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

	}




	const toRequestDto = (supDetail): ISupplierInfoDetailDto => {

		


		for (var key in supDetail) {
			//	console.log(`key:  ${key} `)
			if (key === "phone") {
				request.toRequestDto[key] = phRef.current;
				//alert("ref"+request.toRequestDto[key])
			} else {
				let changeKey = keyChange(key);
				request.toRequestDto[changeKey] = supDetail[key];
				console.log(`key:${key}   변형된 key: ${changeKey} \n  toRequestDto 의 value: ${request.toRequestDto[key]} supDetail 의 valye: ${supDetail[key]}`)
			}
		}

		return request.toRequestDto;

	}

	const handleAddressSelect = (data: any) => {
		let address = data.roadAddress; // 도로명 주소
		if (!address) address = data.jibunAddress; // 지번 주소
		// console.log("우편번호: " + data.zonecode);
		// console.log("주소: " + address);
		const box = { ...supDetail };
		box.ZipCode = data.zonecode
		box.address = address
		alert(box.ZipCode)
		setSupDetail(box);
		setIsPostcodeOpen(false);
	};



	const handleUpdateChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		const { name, value } = e.target;
		//detailInfo
		console.log(`네임: ${name}     밸류: ${value}`);
		setSupDetail((prevData) => ({
			...prevData,
			[name]: value,
		}));

	}


	const handlePhonUpdateChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		const { name, value } = e.target;
		//detailInfo
		console.log(`네임: ${name}     밸류: ${value}`);
		setSupDetail((prevData) => ({
			...prevData,
			[name]: value,
		}));
	}



	return (<>

		<UserInfoModalStyle>
			{/* 1열 */}
			<div className='container'>
				<table>
					<colgroup>
						<col width='30%' />
						<col width='30%' />
						<col width='30%' />
					</colgroup>
					<tbody>
						<tr id="writer" >
							<th scope="row">작성자 </th>
							<td colSpan={1}>

								<div className="inputTxt p100" id="author" >

									{supDetail ? (
										<StyledInput name="author" value={supDetail.author} readOnly></StyledInput>
									) : (
										<StyledInput type="text"
											name="author" id="supplyLoginID" placeholder="숫자, 영문자 조합으로 6~20자리" />
									)}
								</div>
							</td>
							<th scope="row">작성일</th>
							<td colSpan={1}>
								<div className="inputTxt p100" id="createdDate">
									{supDetail ? (
										<StyledInput name="createdDate" value={supDetail.createdDate} readOnly></StyledInput>
									) : (
										<StyledInput type="text"
											name="createdDate" id="supplyLoginID" placeholder="숫자, 영문자 조합으로 6~20자리" />
									)}


								</div>
							</td>
						</tr>
						<tr>
							<th scope="row">아이디<span className="font_red">*</span></th>
							<td colSpan={2}>
								{supDetail ? (
									<StyledInput name="loginID" value={supDetail.loginID} readOnly></StyledInput>
								) : (
									<StyledInput type="text" className="inputTxt p100"
										name="supplyLoginID" id="supplyLoginID" placeholder="숫자, 영문자 조합으로 6~20자리" />
								)}
							</td>

							{supDetail ? (
								<></>
							) : (
								<>
									<td colSpan={1}>
										<StyledInput type="button" value="중복확인"
											id="IdCheckBtn"
										/>

									</td>
								</>

							)}
						</tr>
						<tr id="">
							<th scope="row">납품업체명<span className="font_red">*</span></th>
							<td colSpan={3}>

								{/* 주의 사항 프론트에선 supplyName 네임으로 보내야한다. 허나 코드가 꼬이니
									axio 요청전 supplyName 으로 보내면 된다 이런게 몇개들이 있으니 주의
								*/}

								{supDetail ? (
									<StyledInput name="name" value={supDetail.name} onChange={handleUpdateChange} ></StyledInput>
								) : (
									<StyledInput type="text"
										name="name" id="supplyLoginID" placeholder="숫자, 영문자 조합으로 6~20자리" />
								)}




							</td>
						</tr>
						<tr>
							<th scope="row">담당자명<span className="font_red">*</span></th>
							<td colSpan={3}>

								{/* 주의 사항 프론트에선 supplyManager 네임으로 보내야한다. 허나 코드가 꼬이니
									axio 요청전 supplyName 으로 보내면 된다 이런게 몇개들이 있으니 주의
									<input type="text" className="inputTxt p100" name="supplyManager" id="supplyManager" />
								*/}

								{supDetail ? (
									<StyledInput name="manager" value={supDetail.manager} onChange={handleUpdateChange} ></StyledInput>
								) : (
									<StyledInput type="text"
										name="manager" id="supplyLoginID" placeholder="숫자, 영문자 조합으로 6~20자리" />
								)}



							</td>
						</tr>
						<tr>
							<th scope="row">담당자 연락처<span className="font_red">*</span></th>
							<td colSpan={3}>


								{/* 주의 사항 프론트에선 supplyPhone 네임으로 보내야한다. 허나 코드가 꼬이니
									axio 요청전 supplyName 으로 보내면 된다 이런게 몇개들이 있으니 주의
								<input type="text" className="inputTxt p100" name="supplyPhone" id="supplyPhone" placeholder="숫자만 입력 가능합니다."
								/>
								*/}

								{supDetail ? (
									<StyledInput name="phone" value={supDetail.phone} onChange={handleUpdateChange}></StyledInput>
								) : (
									<StyledInput type="text"
										name="phone" id="supplyLoginID" placeholder="숫자, 영문자 조합으로 6~20자리" />
								)}

							</td>
						</tr>
						<tr>
							<th scope="row">우편번호<span className="font_red">*</span></th>
							<td colSpan={2}>
								{/* 서버로 보낼시 name=zipCode 
								<input type="text" className="inputTxt p100"name="supplyZipCode" id="supplyZipCode" readOnly />
								*/}

								{supDetail ? (
									<StyledInput name="ZipCode" value={supDetail.ZipCode} readOnly></StyledInput>
								) : (
									<StyledInput type="text"
										name="ZipCode" id="supplyLoginID" placeholder="숫자, 영문자 조합으로 6~20자리" />
								)}
							</td>
							<td colSpan={1}>
								<StyledButton onClick={() => setIsPostcodeOpen(true)}>우편번호 찾기</StyledButton>
							</td>
						</tr>
						<tr>
							<th scope="row">주소<span className="font_red">*</span></th>
							<td colSpan={3}>


								{/* 서버로 보낼시 name=supplyAddress 
									<input type="text" className="inputTxt p100" name="supplyAddress" id="supplyAddress" readOnly />
								*/}

								{supDetail ? (
									<StyledInput name="address" value={supDetail.address} readOnly></StyledInput>
								) : (
									<StyledInput type="text"
										name="address" id="supplyLoginID" placeholder="숫자, 영문자 조합으로 6~20자리" />
								)}



							</td>
						</tr>
						<tr>
							<th scope="row">상세주소</th>
							<td colSpan={3}>

								{/* 서버로 보낼시 name=supplyDetailAddress 
										<input type="text" className="inputTxt p100" name="supplyDetailAddress" id="supplyDetailAddress" />
								*/}

								{supDetail ? (
									<StyledInput name="detailAddress" value={supDetail.detailAddress} readOnly></StyledInput>
								) : (
									<StyledInput type="text"
										name="detailAddress" id="supplyLoginID" placeholder="숫자, 영문자 조합으로 6~20자리" />
								)}


							</td>
						</tr>


						<tr>
							<th scope="row">패스워드<span className="font_red">*</span></th>
							<td colSpan={3}>
								{/* <input type="password" className="inputTxt p100" name="password" id="password" /> */}
								{supDetail ? (
									<StyledInput name="password" type="password" value={supDetail.password} readOnly></StyledInput>
								) : (
									<StyledInput type="text"
										name="password" id="supplyLoginID" placeholder="숫자, 영문자 조합으로 6~20자리" />
								)}



							</td>
						</tr>
						<tr>
							<th scope="row">거래상태 <span className="font_red">*</span></th>
							<td colSpan={3}>

								{/* 서버로 보낼시는 TradeState  */}
								{supDetail ? (
									<>
										<label>
											<StyledInput type="radio" name="tradeState" id="TradeStateY" value="Y" checked={supDetail?.tradeState === "Y"} /> Yes
											<StyledInput type="radio" name="tradeState" id="TradeStateN" value="N" checked={supDetail?.tradeState === "N"} /> No
										</label>
									</>
								) : (


									<>
										<label>
											<StyledInput type="radio" name="tradeState" id="TradeStateY" value="Y" /> Yes
										</label>
										<label>
											<StyledInput type="radio" name="tradeState" id="TradeStateN" value="N" checked /> No
										</label>

									</>



								)}







							</td>
						</tr>

					</tbody>


				</table>


				<div className="btn_areaC mt30">
					{supDetail ? (<>

						{supDetail?.tradeState === "Y" ? (<>
							<StyledButton onClick={goUpdateFnc}  >수정</StyledButton>
							<StyledButton onClick={goDeleteFnc}   >삭제</StyledButton>

						</>) : (<>

							<StyledButton onClick={goRecoverFnc} >거래 재개</StyledButton>
						</>)}

					</>)

						: (<>

							<StyledButton >저장</StyledButton>
						</>)}

					{supDetail ? <StyledButton onClick={closeDetailModal}>취소</StyledButton> : <StyledButton>취소</StyledButton>}

				</div>



			</div>
			{isPostcodeOpen && (


				<DaumPostcode
					onComplete={handleAddressSelect} // 주소 선택 완료 시 호출되는 함수
				/>

			)}
		</UserInfoModalStyle>
	</>)

}