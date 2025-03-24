import { searchSupplierNameListApi } from "../../../../../api/ProductInfoApi/searchSupplierNameListApi";
import { searchProductDetailApi } from "../../../../../api/ProductInfoApi/searchProductDetailApi";
import { searchCategoryListApi } from "../../../../../api/ProductInfoApi/searchCategoryListApi";
import { UserInfoModalStyle } from "../../UserInfo/UserInfoModal/styled";
import { ChangeEvent, FC, useEffect } from "react";
import { ProductInfo } from "../../../../../api/api";
import { useState } from "react";
import { IProductDetailResponse } from "../../../../../models/interface/IProductInfoSS";
import { IProductDetail } from "../../../../../models/interface/IProductInfoSS";
import { IUpdateRequestDto } from "../../../../../models/interface/IProductInfoSS";
import { useRef, useContext } from "react";
import { StyledButton } from "../../../../common/StyledButton/StyledButton";
import { StyledInput } from "../../../../common/StyledInput/StyledInput";
import { useRecoilState } from "recoil";
import { modalState } from "../../../../../stores/modalState";
import { postDeleteFileApi } from "../../../../../api/ProductInfoApi/postDeleteFileApi";
import { postUpdateProductInfoApi } from "../../../../../api/ProductInfoApi/postUpdateProductInfoApi";
import { IPostResultMessageResponse } from "../../../../../models/interface/IProductInfoS";
import { useNavigate } from "react-router-dom";
import { IInsertProductDetail } from "../../../../../models/interface/IProductInfoSS";
import { v4 as uuidv4 } from "uuid";
import { postSaveProductInfoApi } from "../../../../../api/ProductInfoApi/postSaveProductInfoApi";
import { detailModalState } from "../../../../../stores/modalState";
import { postDeleteProductInfoApi } from "../../../../../api/ProductInfoApi/postDeleteProductInfoApi";
import { ProductInfoContext } from "../../../../../api/Provider/ProductInfo/ProductInfoProvider";
import { PostRender } from "../../PostRender/PostRender";
import { ProductDefaultSearchKeyWord } from "../defaultSearchKeyWord/ProductDefaultKeyword";
import { ManageMentWrapperButtonStyle } from "../../ManageMentStyle/ManageMentWrapperButtonStyle/ManageMentWrapperButtonStyle";
import { ManageMentStyledButton } from "../../ManageMentStyle/ManageMentStyledButton/ManageMentStyledButton";
import { UserInfoSelectWrapperStyle } from "../../UserInfo/UserInfoSelectWrapperStyle/UserInfoSelectWrapperStyle";

export interface IProductInfoModalProps {
    productId?: string;
}

const updateEmptyCheck = {
    name: "제품명은 필수입력 사항 입니다.",
    productNumber: "제품번호 필수 입력 사항 입니다.",
    sellPrice: "제품 가격은 필수 입력 사항입니다.",
    description: "상세정보는 필수 입력 사항입니다.",
};

const emptyCheck = {
    name: "제품명은 필수입력 사항 입니다.",
    sellPrice: "제품 가격은 필수입력 사항 입니다.",
    description: "제품 상세 정보는 필수입력 사항 입니다.",
};

const updateValiCheck = {
    sellPrice: "제품 가격은 숫자로, 0보다 큰 양의정수만  입력 가능합니다.",
};

const valiCheck = {
    sellPrice: "제품 가격은 숫자로, 0보다 큰 양의정수만  입력 가능합니다.",
};

export const ProductInfoModal: FC<IProductInfoModalProps> = ({ productId }) => {
    const navi = useNavigate();
    const optionKey = uuidv4();
    const [updateModal, setUpdateModal] = useRecoilState(modalState);
    // console.log("프롭스 값:   " + productId);
    const [imageUrl, setImageUrl] = useState<string>("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [fileName, setFileName] = useState<string>("");
    const [modal, setModal] = useRecoilState(detailModalState);
    const [insertProductDetail, setInsertProductDetail] = useState<IInsertProductDetail>({
        name: "",
        productNumber: "",
        sellPrice: -1,
        description: "",
        supplierName: "",
        category: "",
        fileInput: null,
        supplyId: -1,
        categoryCode: "",
        empty: "empty",
    });

    const [supNameList, setSupNameList] = useState([]);

    const [productDetail, setProductDetail] = useState<IProductDetail>();

    const [categoryList, setCategoryList] = useState([]);

    const { searchKeyword, setSearchKeyword } = useContext(ProductInfoContext);

    const updateRef = useRef<IUpdateRequestDto>({
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
    });

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

        //카테고리 리스트
        const res3: any = await searchCategoryListApi(ProductInfo.categoryList);

        console.log(res3);
        setCategoryList(res3);
    }
    async function insertProductinitFnc() {
        //납품업체 리스트
        const res2: any = await searchSupplierNameListApi(ProductInfo.supplierNameList);
        setSupNameList(res2);
        // console.log(res2);

        //카테고리 리스트
        const res3: any = await searchCategoryListApi(ProductInfo.categoryList);

        // console.log(res3);
        setCategoryList(res3);

        const box = { ...insertProductDetail };
        box.supplyId = res2[0].supplyId;
        box.categoryCode = res3[0].categoryCode;
        setInsertProductDetail(box);
    }
    useEffect(() => {
        if (productId != undefined) {
            initFnc();
            updateRef.current.productId = parseInt(productId);
        } else {
            insertProductinitFnc();
        }
    }, []);

    useEffect(() => {
        console.log(productDetail);
        if (productDetail?.logicalPath != null) {
            setImageUrl(productDetail?.logicalPath);
        }
    }, [productDetail]);

    const inserInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        if (productDetail != undefined) {
            setProductDetail((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        } else {
            setInsertProductDetail((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
    };

    const updateInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const rawValue = value.replace(/[^0-9]/g, "");
        console.log(`name ${name}  value ${value}`);

        if (name === "sellPrice") {
            setProductDetail((prevData) => ({
                ...prevData,
                [name]: rawValue ? parseInt(rawValue, 10) : 0,
            }));
            return;
        }

        setProductDetail((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const insertSupplierHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
        console.log(insertProductDetail);
        const { name, value } = e.target;

        console.log(`name: ${name}   value: ${value}`);

        const selectedOption = e.target.selectedOptions[0];
        const supplyId = selectedOption?.getAttribute("data-supplyid");
        // alert(supplyId);

        const box = { ...insertProductDetail };
        box.supplyId = parseInt(supplyId);
        setInsertProductDetail(box);
    };

    const updateCategoryHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        const selectedOption = e.target.selectedOptions[0];
        const categoryId = selectedOption?.getAttribute("data-categorycode");

        updateRef.current.category = categoryId;
        updateRef.current.categoryCode = categoryId;

        const box = { ...productDetail };
        box.categoryCode = categoryId;
        box.category = value;
        setProductDetail(box);
    };

    const insertCateHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        const category = value;
        const selectedOption = e.target.selectedOptions[0];
        const categoryCode = selectedOption?.getAttribute("data-categoryCode");

        console.log(`name: ${name}  value: ${value}`);
        setInsertProductDetail((prevData) => ({
            ...prevData,
            category: category,
            categoryCode: categoryCode,
        }));
    };

    const inserthandlerFile = (e: ChangeEvent<HTMLInputElement>) => {
        const fileInfo = e.target.files;
        updateRef.current.fileInput = fileInfo[0];
        if (fileInfo?.length > 0) {
            const file = fileInfo[0];
            const fileSplit = fileInfo[0].name.split(".");
            const fileExt = fileSplit[1].toLowerCase();

            if (fileExt === "jpg" || fileExt === "gif" || fileExt === "png") {
                setImageUrl(URL.createObjectURL(fileInfo[0]));
            }

            setImageFile(file);
            updateRef.current.fileInput = file;
            setFileName(fileInfo[0].name);
        }
    };

    const handlerFile = (e: ChangeEvent<HTMLInputElement>) => {
        const fileInfo = e.target.files;
        updateRef.current.fileInput = fileInfo[0];
        if (fileInfo?.length > 0) {
            const file = fileInfo[0];
            const fileSplit = fileInfo[0].name.split(".");
            const fileExt = fileSplit[1].toLowerCase();

            if (fileExt === "jpg" || fileExt === "gif" || fileExt === "png") {
                setImageUrl(URL.createObjectURL(fileInfo[0]));
            }

            setImageFile(file);
            updateRef.current.fileInput = file;
            setFileName(fileInfo[0].name);
        }
    };

    const deleteFileFnc = async () => {
        //productId: 23
        const res: IPostResultMessageResponse = await postDeleteFileApi(ProductInfo.deleteFile, {
            productId: productId,
        });

        if (res.result === "success") {
            alert("파일을 삭제 하였습니다.");
            setImageUrl(null);
            setImageFile(null);
            const box = { ...productDetail };
            box.logicalPath = null;
            setProductDetail(box);
        }
    };

    const goUpdate = async () => {
        const formData = toFormData(productDetail);
        console.log(productDetail);

        if (!updateEmptyCheckFnc(formData)) {
            return;
        }
        if (!updateValiCheckFnc(formData)) {
            return;
        }

        const res: IPostResultMessageResponse = await postUpdateProductInfoApi(ProductInfo.updateProductInfo, formData);

        if (res.result === "success") {
            alert("제품 정보를 수정하였습니다.");
            setUpdateModal(!updateModal);
            navi("/react/management/product-info");
            PostRender(ProductDefaultSearchKeyWord, setSearchKeyword);
        } else {
            alert("잠시후다시 시도해주세요");
            setUpdateModal(!updateModal);
            navi("/react/management/product-info");
        }
    };

    const goInsert = async () => {
        if (!emptyCheckFnc()) {
            return;
        }
        if (!valiCheckFnc()) {
            return;
        }

        const formData = toFormData(insertProductDetail);

        const res: IPostResultMessageResponse = await postSaveProductInfoApi(ProductInfo.saveProductInfo, formData);

        if (res.result === "success") {
            alert("제품정보를 등록하였습니다.");
            setModal(!modal);
            setSearchKeyword({
                currentPage: 1,
                pageSize: 5,
                searchKeyword: "",
                searchOption: "searchAll",
            });
        }
    };

    const toFormData = <T extends Record<string, any>>(x: T): FormData => {
        // updateRef의 값들을 FormData로 변환

        const formData = new FormData();

        // insertProductDetail의 값들을 FormData에 자동으로 추가
        for (const [key, value] of Object.entries(x)) {
            if (key === "sellPrice" || key === "supplyId") {
                formData.append(key, String(value)); // 해당 값들을 문자열로 변환하여 추가
            } else {
                formData.append(key, value); // 그 외 값들은 그대로 추가
            }
        }

        // fileInput이 존재하는 경우 파일을 FormData에 추가
        if (imageFile) {
            formData.append("file", imageFile); // file은 formData에 추가하는 키입니다.
        }
        // FormData를 배열로 변환 후 출력
        const formDataArray = Array.from(formData.entries());

        formDataArray.forEach(([key, value]) => {
            console.log(key, value);
        });

        return formData;
    };

    const goDetateProduct = async () => {
        const res: IPostResultMessageResponse = await postDeleteProductInfoApi(ProductInfo.deleteProductInfo, {
            productId: productId,
        });

        if (res.result === "success") {
            alert("제품정보를 삭제 하였습니다.");
            setUpdateModal(!updateModal);
            PostRender(ProductDefaultSearchKeyWord, setSearchKeyword);
        } else if (res.result === "fail") {
            alert("잠시후 다시 시도해주세요");
        } else {
            alert(
                `해당 제품은 ${productDetail.supplier} 납품업체가 창고에서 운용하는 제품으로` +
                    "\n  납품업체에게 문의 바랍니다."
            );
        }
    };

    const updateEmptyCheckFnc = (formData: FormData): boolean => {
        for (var key in updateEmptyCheck) {
            const formValue: any = formData.get(key); // formData에서 값을 가져오기

            if (formValue === "" || formValue < 0) {
                alert(updateEmptyCheck[key]);
                return false;
            }
        }
        return true;
    };

    const updateValiCheckFnc = (formData: FormData): boolean => {
        for (var key in updateValiCheck) {
            const formValue: any = formData.get(key);
            const isPositiveInteger = /^[1-9]\d*$/.test(formValue);
            if (!isPositiveInteger) {
                alert(updateValiCheck[key]);
                return false;
            }
        }

        return true;
    };

    const emptyCheckFnc = (): boolean => {
        for (var key in emptyCheck) {
            if (insertProductDetail[key] === "" || insertProductDetail[key] < 0) {
                alert(emptyCheck[key]);
                return false;
            }
        }

        return true;
    };

    const valiCheckFnc = (): boolean => {
        for (var key in valiCheck) {
            // formData에서 값을 가져오기
            const isPositiveInteger = /^[1-9]\d*$/.test(insertProductDetail[key]);
            if (!isPositiveInteger) {
                alert(valiCheck[key]);
                return false;
            }
        }
        return true;
    };

    return (
        <UserInfoModalStyle>
            <div className='container'>
                <dt>
                    <strong>제품 정보</strong>
                </dt>
                <table className='row'>
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
                                <StyledInput
                                    type='text'
                                    className='inputTxt p100'
                                    name='name'
                                    id='name'
                                    onChange={inserInputHandler}
                                    value={productDetail != undefined ? productDetail?.name : insertProductDetail?.name}
                                />
                            </td>
                        </tr>
                        <tr>
                            <th scope='row'>
                                제품번호 <span className='font_red'>*</span>
                            </th>
                            <td colSpan={3}>
                                <StyledInput
                                    type='text'
                                    className='inputTxt p100'
                                    name='productNumber'
                                    value={
                                        productDetail != undefined
                                            ? productDetail?.productNumber
                                            : insertProductDetail?.productNumber
                                    }
                                    onChange={inserInputHandler}
                                    id='productNumber'
                                />
                            </td>
                        </tr>
                        <tr>
                            <th scope='row'>
                                제품가격<span className='font_red'>*</span>
                            </th>

                            <td colSpan={3}>
                                {productDetail !== undefined ? (
                                    <>
                                        <StyledInput
                                            type='text'
                                            className='inputTxt p100'
                                            name='sellPrice'
                                            value={
                                                productDetail?.sellPrice
                                                    ? new Intl.NumberFormat().format(productDetail.sellPrice) + " 원"
                                                    : productDetail?.sellPrice
                                            }
                                            onChange={updateInputHandler}
                                            id='sellPrice'
                                        />
                                    </>
                                ) : (
                                    <>
                                        <StyledInput
                                            type='text'
                                            className='inputTxt p100'
                                            name='sellPrice'
                                            onChange={inserInputHandler}
                                            value={
                                                insertProductDetail?.sellPrice < 0 ? "" : insertProductDetail?.sellPrice
                                            }
                                            id='sellPrice'
                                        />
                                    </>
                                )}
                            </td>
                        </tr>
                        <tr>
                            <th scope='row'>
                                상세정보<span className='font_red'>*</span>
                            </th>
                            <td colSpan={3}>
                                <StyledInput
                                    type='text'
                                    className='inputTxt p100'
                                    name='description'
                                    value={
                                        productDetail !== undefined
                                            ? productDetail?.description
                                            : insertProductDetail?.description
                                    }
                                    onChange={inserInputHandler}
                                    id='description'
                                />
                            </td>
                        </tr>
                        <tr>
                            <th scope='row'>
                                납품업체<span className='font_red'>*</span>
                            </th>
                            <td colSpan={3}>
                                {productDetail !== undefined ? (
                                    <>
                                        <StyledInput
                                            name='category'
                                            id='category'
                                            value={productDetail?.supplier}
                                            data-supplyid={productDetail?.supplyId}
                                        ></StyledInput>
                                    </>
                                ) : (
                                    <>
                                        <UserInfoSelectWrapperStyle variant='primary' className='selectWrapper'>
                                            <select
                                                className='styledTag'
                                                name='supplyId'
                                                id='supplier'
                                                onChange={insertSupplierHandler}
                                            >
                                                {supNameList.map((ele, index) => {
                                                    // supplyId가 0일 경우, 0에 랜덤 값을 추가하여 중복을 방지
                                                    const supplyId = ele.supplyId === 0 ? uuidv4() : ele.supplyId; // uuid를 사용하여 고유값 생성
                                                    const optionKey = `${supplyId}-${index}`; // supplyId와 index를 조합
                                                    return (
                                                        <option key={optionKey} data-supplyid={ele.supplyId}>
                                                            {ele.name}
                                                        </option>
                                                    );
                                                })}
                                            </select>
                                        </UserInfoSelectWrapperStyle>
                                    </>
                                )}
                            </td>
                        </tr>
                        <tr>
                            <th scope='row'>
                                카테고리<span className='font_red'>*</span>
                            </th>
                            <td colSpan={3}>
                                <UserInfoSelectWrapperStyle variant='primary' className='selectWrapper'>
                                    <select
                                        className='styledTag'
                                        name='category'
                                        id='category'
                                        value={
                                            productDetail !== undefined
                                                ? productDetail?.category
                                                : insertProductDetail?.category
                                        }
                                        onChange={
                                            productDetail !== undefined ? updateCategoryHandler : insertCateHandler
                                        }
                                    >
                                        {categoryList.map((ele, index) => {
                                            // supplyId가 0일 경우, 0에 랜덤 값을 추가하여 중복을 방지
                                            const supplyId =
                                                ele.supplyId === 0
                                                    ? Math.random().toString(36).substring(2, 15)
                                                    : ele.supplyId;
                                            const optionKey = `${supplyId}-${index}`; // supplyId와 index를 조합
                                            return (
                                                <option key={optionKey} data-categorycode={ele.categoryCode}>
                                                    {ele.category}
                                                </option>
                                            );
                                        })}
                                    </select>
                                </UserInfoSelectWrapperStyle>
                            </td>
                        </tr>
                        <tr id='fileNo'>
                            <th scope='row' className='fileBtn'>
                                파일
                            </th>
                            <td colSpan={3}>
                                <div className={"button-container"}>
                                    {imageUrl ? (
                                        <></>
                                    ) : (
                                        <>
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
                                        </>
                                    )}
                                </div>
                                <div className={"button-container"}>
                                    {productDetail?.logicalPath != null && imageUrl != null && (
                                        <StyledButton type='button' onClick={deleteFileFnc}>
                                            등록한 사진 삭제
                                        </StyledButton>
                                    )}
                                </div>
                            </td>
                        </tr>
                        <tr>
                            {imageUrl ? (
                                <>
                                    <th scope='row'>미리보기</th>
                                    <td colSpan={3} id='preview'>
                                        <div>
                                            <div>
                                                <img
                                                    src={imageUrl}
                                                    style={{ maxWidth: "400px", maxHeight: "500px" }}
                                                    alt='미리보기'
                                                />
                                            </div>
                                        </div>
                                    </td>
                                </>
                            ) : (
                                <></>
                            )}
                        </tr>
                    </tbody>
                </table>

                <ManageMentWrapperButtonStyle className='btn_areaC mt30'>
                    {productDetail !== undefined ? (
                        <>
                            <ManageMentStyledButton onClick={goUpdate}>수정</ManageMentStyledButton>
                            <ManageMentStyledButton onClick={goDetateProduct}>삭제</ManageMentStyledButton>
                        </>
                    ) : (
                        <>
                            <ManageMentStyledButton onClick={goInsert}>저장</ManageMentStyledButton>
                        </>
                    )}
                    <ManageMentStyledButton
                        onClick={() => {
                            productDetail !== undefined ? setUpdateModal(!updateModal) : setModal(!modal);
                        }}
                    >
                        취소
                    </ManageMentStyledButton>
                </ManageMentWrapperButtonStyle>
            </div>
        </UserInfoModalStyle>
    );
};
