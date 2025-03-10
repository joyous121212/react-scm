
export interface ISupplierInfoSaveDetailDto{

    name: string,  // 공급자 이름
    manager: string,  // 관리자 이름
    phone: string,  // 전화번호
    ZipCode: string,  // 우편번호
    address: string,  // 주소
    detailAddress: string,  // 상세 주소
    supplyLoginID: string,  // 로그인 ID
    password: string,  // 비밀번호
    groupCode: string,  // 그룹 코드
    tradeState: string  // 거래 상태

}
export interface ISupplierSaveDetailRequestDto{
    toSaveRequestDto:ISupplierInfoSaveDetailDto
    }


    export interface ISaveSupplyDetailRespose{

        result:"success"|"fail"
    }





export interface ISupplierInfoDetailDto{
supply_id:string;
name :string;
manager	:string;	
phone:string;
zip_code:string;
address	:string;
detail_address:string;
loginID:string;
password:string;		
group_code:string;		
create_by:string;		
created_date:string;
trade_state: string;
}

export interface ISupplierInfoDetailRequestDto{
    toRequestDto:ISupplierInfoDetailDto
    }






export interface ISupplierInfoDetail{   
//supply_id AS supplyId
   supplyId:string;
    name :string;
    manager	:string;	
    phone:string;		
    //zip_code	AS zipCode
    zipCode:string;
    address	:string;

    //detail_address AS detailAddress
    detailAddress:string;
    loginID:string;
    password:string;		
    //group_code AS groupCode
    groupCode:string
    //create_by AS author		
    author:string
   // created_date AS createdDate		
   createdDate:string;
   // trade_state AS tradeState	
    tradeState: string;
}


export interface ISupplierInfoDetailResponse{
    detailValue:ISupplierInfoDetail
}


export interface IUpdateSupplyDetailRespose{

    result:"success"|"fail"
}

export interface IDeleteSupplyDetailRespose{

    result:"success"|"fail"
}

export interface IRecoverSupplyDetailRespose{

    result:"success"|"fail"
}


export interface ISupplierSaveInfoDetail{   
    //supply_id AS supplyId
        supplyLoginID:string;
        name :string;
        manager	:string;	
        phone:string;		
        //zip_code	AS zipCode
        zipCode:string;
        address	:string;
    
        //detail_address AS detailAddress
        detailAddress:string;
        loginID:string;
        password:string;		
        //group_code AS groupCode
        groupCode:string
        //create_by AS author		
        author:string
       // created_date AS createdDate		
       createdDate:string;
       // trade_state AS tradeState	
        tradeState: string;
    }







// var param = {
// 	name: $("#supplyName").val()
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