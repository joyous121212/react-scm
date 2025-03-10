import { searchSupplierNameListApi } from "../../../../../api/ProductInfoApi/searchSupplierNameListApi";
import { searchProductDetailApi } from "../../../../../api/ProductInfoApi/searchProductDetailApi";
import { searchCategoryListApi } from "../../../../../api/ProductInfoApi/searchCategoryListApi";
import { UserInfoModalStyle } from "../../UserInfo/UserInfoModal/styled";
import { ChangeEvent, FC, useEffect } from "react";
import { ProductInfo } from "../../../../../api/api";
import { useState } from "react";
import { IProductDetailResponse } from "../../../../../models/interface/store/IProductInfo";
import { IProductDetail } from "../../../../../models/interface/store/IProductInfo";
import { IUpdateRequestDto } from "../../../../../models/interface/store/IProductInfo";
import { useRef } from "react";
import { StyledButton } from "../../../../common/StyledButton/StyledButton";
import { StyledInput } from "../../../../common/StyledInput/StyledInput";
export interface IProductInfoModalProps {
    productId?: string;
}

export const ProductInfoModal: FC<IProductInfoModalProps> = ({ productId }) => {
   // console.log("프롭스 값:   " + productId);
   const [imageUrl, setImageUrl] = useState<string>("");
   const [fileName, setFileName] = useState<string>("");
  
    const [supNameList, setSupNameList] = useState([]);

    const [productDetail, setProductDetail] = useState<IProductDetail>();

    const [categoryList ,setCategoryList]=useState([]);

    const [updateData,setUpData]=useState([])

    const updateRef=useRef<IUpdateRequestDto>(
        {
            productId: -100,            
            name: "",                   
            productNumber: "",          
            sellPrice: -100,            
            description: "",            
            supplierName: -100,         
            category: "",               
            fileInput: null,             
            supplyId: -100,             
            categoryCode: "",           
            empty: "",                  
        }
    );

    useEffect(() => {
        async function initFnc() {
            //제품에 대한 정보: 주의 해야 할것은 제품등록시, 그 해당제품이 납품업체와, 카테고리를 결정한다는 것이다.
            // 즉 한제품당  row 한개이다.
            const res1: IProductDetailResponse = await searchProductDetailApi(ProductInfo.productDetail, {
                productId: productId,
            });
            setProductDetail(res1.detailValue);
            //납품업체 리스트
            const res2: any = await searchSupplierNameListApi(ProductInfo.supplierNameList);
            setSupNameList(res2);
            console.log(res2);

            //카테고리 리스트
            const res3: any = await searchCategoryListApi(ProductInfo.categoryList);

            console.log(res3);
            setCategoryList(res3)
            
        }

        if (productId != undefined) {
           
            initFnc();
            updateRef.current.productId=parseInt(productId);
        }
        
    }, []);

    
    useEffect(()=>{
        console.log(productDetail)
    },[productDetail])

    const checkout=()=>{
        console.log(updateRef);
    }

    const updateInputHandler=(e: React.ChangeEvent<HTMLInputElement>)=>{

    }
    const updateHandler=(e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        const selectedOption = e.target.selectedOptions[0];
        const supplyId = selectedOption?.getAttribute('data-supplyId');
        console.log(`네임: ${name}     밸류: ${value}     공급ID: ${supplyId}`);
        
        updateRef.current.supplyId=parseInt(supplyId);
        updateRef.current.supplierName=parseInt(supplyId);
//updateRef.current.categoryCode=categoryId;


        setProductDetail((prevData) => ({
            ...prevData,
            [name]: value,
        }));

    }
    const updateCategoryHandler=(e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        const selectedOption = e.target.selectedOptions[0];
        const categoryId= selectedOption?.getAttribute('data-categoryCode');

        console.log(`네임: ${name}     밸류: ${value}     공급ID: ${categoryId}`);
        updateRef.current.category=categoryId;
        updateRef.current.categoryCode=categoryId;
        setProductDetail((prevData) => ({
            ...prevData,
            [name]: value,
        }));

    }


    const handlerFile = (e: ChangeEvent<HTMLInputElement>) => {
        const fileInfo = e.target.files;
       
        updateRef.current.fileInput=fileInfo[0];
        if (fileInfo?.length > 0) {
            const fileSplit = fileInfo[0].name.split(".");
            const fileExt = fileSplit[1].toLowerCase();

            console.log("파일명: "+fileInfo[0].name+" 파일확장자."+fileExt)
            if (fileExt === "jpg" || fileExt === "gif" || fileExt === "png") {
                setImageUrl(URL.createObjectURL(fileInfo[0]));
            }
            setFileName(fileInfo[0].name);
        }
    };



    return (
        <UserInfoModalStyle>
            <div className='container'>
                <table className='row'>
                    <caption>caption</caption>
                    <colgroup>
                        <col width='120px' />
                        <col width='*' />
                        <col width='120px' />
                        <col width='*' />
                    </colgroup>
                    <tbody>
                        <tr>
                            <th scope='row'>
                                제품명 <span className='font_red'>*</span>
                            </th>
                            <td colSpan={3}>
                                <input type='text' className='inputTxt p100' name='name' id='name'  value={productDetail?.name} />
                            </td>
                        </tr>
                        <tr>
                            <th scope='row'>
                                제품번호 <span className='font_red'>*</span>
                            </th>
                            <td colSpan={3}>
                                <input type='text' className='inputTxt p100' name='productNumber' value={productDetail?.productNumber}  id='productNumber' />
                            </td>
                        </tr>
                        <tr>
                            <th scope='row'>
                                제품가격<span className='font_red'>*</span>
                            </th>
                            <td colSpan={3}>
                                <input type='text' className='inputTxt p100' name='sellPrice' value={productDetail?.sellPrice} id='sellPrice' />
                            </td>
                        </tr>
                        <tr>
                            <th scope='row'>
                                상세정보<span className='font_red'>*</span>
                            </th>
                            <td colSpan={3}>
                                <input type='text' className='inputTxt p100' name='description' value={productDetail?.description} id='description' />
                            </td>
                        </tr>
                        <tr>
                            <th scope='row'>
                                납품업체<span className='font_red'>*</span>
                            </th>
                            <td colSpan={3}>
                                {productDetail !== undefined ? (
                                    <>
                                        <select name='supplier' id='supplier' value={productDetail.supplier} onChange={updateHandler}>
                                            {supNameList.map((ele) => {
                                                return <option key={ele.supplyId} data-supplyId={ele.supplyId}>{ele.name}</option>;
                                            })}
                                        </select>
                                    </>
                                ) : (
                                    <>
                                        <select name='supplierName' id='supplier'></select>
                                    </>
                                )}
                            </td>
                        </tr>
                        <tr>
                            <th scope='row'>
                               
                                카테고리<span className='font_red'>*</span>
                            </th>
                            <td colSpan={3}>
                            {productDetail !== undefined ? (
                                    <>
                                        <select name='category' id='category' value={productDetail.category} onChange={updateCategoryHandler}>
                                            {categoryList.map((ele) => {
                                                return <option key={ele.categoryCode} data-categoryCode={ele.categoryCode}>{ele.category}</option>;
                                            })}
                                        </select>
                                    </>
                                ) : (
                                    <>
                                         <select name='category' id='category'></select>
                                    </>
                                )}
                               
                            </td>
                        </tr>
                        <tr id='fileNo'>
                            <th scope='row' className='fileBtn'>
                                파일
                            </th>
                            <td colSpan={3}>
                            <div className={"button-container"}>
                            {productDetail!== undefined && productDetail?.fileName!=null ?(<>
                                {/* <StyledInput type='file' className='inputTxt p80' name='fileInput' id='fileInput' /> */}
                                <StyledButton type='button'>
                                삭제
                            </StyledButton>
                               
                            </>) 
                            :(<>
                    
                    <StyledInput
                        type='file'
                        id='fileInput'
                        style={{ display: "none" }}
                        name='file'
                        onChange={handlerFile}
                    ></StyledInput>
                    <label className='img-label' htmlFor='fileInput'>
                        파일 첨부하기
                    </label>
                                  
                            </>)}
                              
                               
                               </div>
                            </td>
                        </tr>
                        <tr>
                            <th scope='row'>미리보기</th>
                            <td colSpan={3} id='preview'>
                            <div>
                        {imageUrl ? (
                            <div>
                                <img src={imageUrl} />
                                {/* {fileName || detail.fileName} */}
                            </div>
                        ) : (
                            <></>
                            // <div>{fileName}</div>
                        )}
                    </div>


                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            
					<div className="btn_areaC mt30">
						<StyledButton  onClick={checkout}><span>수정</span></StyledButton>
						<StyledButton ><span>삭제</span></StyledButton>
						<StyledButton ><span>취소</span></StyledButton>
						<StyledButton ><span>저장</span></StyledButton>
					</div>
        </UserInfoModalStyle>
        
    );
};
