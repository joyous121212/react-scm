

export interface ISupplierInfoDetailDto{
supply_id:string;
name :string;
manager	:string;	
phone:string;
Zip_code:string;
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
    ZipCode:string;
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