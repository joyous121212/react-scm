import { searchSupplierNameListApi } from "../../../../../api/ProductInfoApi/searchSupplierNameListApi";
import { searchProductDetailApi } from "../../../../../api/ProductInfoApi/searchProductDetailApi";
import { searchCategoryListApi } from "../../../../../api/ProductInfoApi/searchCategoryListApi";
import { UserInfoModalStyle } from "../../UserInfo/UserInfoModal/styled";
import { FC, useEffect } from "react";
import { ProductInfo } from "../../../../../api/api";
import { useState } from "react";
import { IProductDetailResponse } from "../../../../../models/interface/store/IProductInfo";
import { IProductDetail } from "../../../../../models/interface/store/IProductInfo";

export interface IProductInfoModalProps {
    productId?: string;
}

export const ProductInfoModal: FC<IProductInfoModalProps> = ({ productId }) => {
    console.log("프롭스 값:   " + productId);

    const [supNameList, setSupNameList] = useState([]);

    const [productDetail, setProductDetail] = useState<IProductDetail>();

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
        }

        if (productId != undefined) {
            initFnc();
        }
    }, []);

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
                                <input type='text' className='inputTxt p100' name='name' id='name' />
                            </td>
                        </tr>
                        <tr>
                            <th scope='row'>
                                제품번호 <span className='font_red'>*</span>
                            </th>
                            <td colSpan={3}>
                                <input type='text' className='inputTxt p100' name='productNumber' id='productNumber' />
                            </td>
                        </tr>
                        <tr>
                            <th scope='row'>
                                제품가격<span className='font_red'>*</span>
                            </th>
                            <td colSpan={3}>
                                <input type='text' className='inputTxt p100' name='sellPrice' id='sellPrice' />
                            </td>
                        </tr>
                        <tr>
                            <th scope='row'>
                                상세정보<span className='font_red'>*</span>
                            </th>
                            <td colSpan={3}>
                                <input type='text' className='inputTxt p100' name='description' id='description' />
                            </td>
                        </tr>
                        <tr>
                            <th scope='row'>
                                납품업체<span className='font_red'>*</span>
                            </th>
                            <td colSpan={3}>
                                {productDetail !== undefined ? (
                                    <>
                                        <select name='supplyName' id='supplier' value={productDetail.supplyName}>
                                            {supNameList.map((ele) => {
                                                return <option key={ele.supplyId}>{ele.name}</option>;
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
                                <select name='category' id='category'></select>
                            </td>
                        </tr>
                        <tr id='fileNo'>
                            <th scope='row' className='fileBtn'>
                                파일
                            </th>
                            <td colSpan={3}>
                                {/* <label for="fileInput" className="fileBtn">파일 선택</label> */}
                                <input type='file' className='inputTxt p80' name='fileInput' id='fileInput' />
                                <span id='fileNameDisplay'></span>
                            </td>
                        </tr>
                        <tr id='fileYes'>
                            <th scope='row'>파일</th>
                            <td colSpan={2}>
                                <input type='text' className='inputTxt p100' name='fileName' id='fileName' disabled />
                            </td>
                            <td colSpan={1}>
                                {/* <a href='' className='fileBtn' id='btnDeleteFile' name='btn'> */}
                                <span>파일 삭제</span>
                                {/* </a> */}
                            </td>
                        </tr>
                        <tr>
                            <th scope='row'>미리보기</th>
                            <td colSpan={3} id='preview'></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </UserInfoModalStyle>
    );
};
