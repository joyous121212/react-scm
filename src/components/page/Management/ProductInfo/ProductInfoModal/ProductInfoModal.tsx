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
import { useRef, useContext } from "react";
import { StyledButton } from "../../../../common/StyledButton/StyledButton";
import { StyledInput } from "../../../../common/StyledInput/StyledInput";
import { useRecoilState } from "recoil";
import { modalState } from "../../../../../stores/modalState";
import { postDeleteFileApi } from "../../../../../api/ProductInfoApi/postDeleteFileApi";
import { postUpdateProductInfoApi } from "../../../../../api/ProductInfoApi/postUpdateProductInfoApi";
import { IPostResultMessageResponse } from "../../../../../models/interface/IProductInfo";
import { useNavigate } from "react-router-dom";
import { IInsertProductDetail } from "../../../../../models/interface/store/IProductInfo";
import { v4 as uuidv4 } from "uuid";
import { postSaveProductInfoApi } from "../../../../../api/ProductInfoApi/postSaveProductInfoApi";
import { detailModalState } from "../../../../../stores/modalState";
import { postDeleteProductInfoApi } from "../../../../../api/ProductInfoApi/postDeleteProductInfoApi";
import { ProductInfoContext } from "../../../../../api/Provider/ProductInfo/ProductInfoProvider";
export interface IProductInfoModalProps {
    productId?: string;
}

const emptyCheck = {
    name: "제품명은 필수입력 사항 입니다.",
    sellPrice: "제품 가격은 필수입력 사항 입니다.",
    description: "제품 상세 정보는 필수입력 사항 입니다.",
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
        name: "", // default empty string
        productNumber: "", // default empty string
        sellPrice: -1, // default negative number
        description: "", // default empty string
        supplierName: "", // default empty string
        category: "", // default empty string
        fileInput: null, // default null (no file)
        supplyId: -1, // default negative number
        categoryCode: "", // default empty string
        empty: "empty",
    });

    const [supNameList, setSupNameList] = useState([]);

    const [productDetail, setProductDetail] = useState<IProductDetail>();

    const [categoryList, setCategoryList] = useState([]);

    const [updateData, setUpData] = useState([]);

    const [crudSuccess, setCrudSuccess] = useState(false);

    const { searchKeyword, setSearchKeyword } = useContext(ProductInfoContext);

    useEffect(() => {
        if (crudSuccess) {
            alert(crudSuccess);
        }
    }, [crudSuccess]);

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
        console.log(res2);

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
        //  console.log(res2[0]);
        // console.log(res3[0]);
        box.supplyId = res2[0].supplyId;
        box.categoryCode = res3[0].categoryCode;
        setInsertProductDetail(box);
    }
    useEffect(() => {
        //productId 로 들어올시 초기 펑션

        //새롭게 만들시 필요한 초기 펑션

        if (productId != undefined) {
            //  console.log(` productId==="" ${productId === ""}  productId==="" ${productId === undefined}`);
            initFnc();
            updateRef.current.productId = parseInt(productId);
        } else {
            insertProductinitFnc();
        }
    }, []);

    useEffect(() => {
        console.log(productDetail);
        setImageUrl(productDetail?.logicalPath);
    }, [productDetail]);

    const inserInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setInsertProductDetail((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const updateInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setProductDetail((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const updateHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        const selectedOption = e.target.selectedOptions[0];
        const supplyId = selectedOption?.getAttribute("data-supplyid");
        //  console.log(`네임: ${name}     밸류: ${value}     공급ID: ${supplyId}`);

        updateRef.current.supplyId = parseInt(supplyId);
        updateRef.current.supplierName = parseInt(supplyId);
        //updateRef.current.categoryCode=categoryId;
        console.log(updateRef.current);
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
        alert(supplyId);

        const box = { ...insertProductDetail };
        box.supplyId = parseInt(supplyId);
        setInsertProductDetail(box);
    };

    const updateCategoryHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        const selectedOption = e.target.selectedOptions[0];
        const categoryId = selectedOption?.getAttribute("data-categorycode");

        // console.log(`네임: ${name}     밸류: ${value}     공급ID: ${categoryId}`);
        updateRef.current.category = categoryId;
        updateRef.current.categoryCode = categoryId;
        setProductDetail((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const insertCateHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        const selectedOption = e.target.selectedOptions[0];
        const categoryCode = selectedOption?.getAttribute("data-categoryCode");

        alert(value);
        setInsertProductDetail((prevData) => ({
            ...prevData,
            categoryCode: value,
        }));
    };
    //주석
    const inserthandlerFile = (e: ChangeEvent<HTMLInputElement>) => {
        const fileInfo = e.target.files;
        updateRef.current.fileInput = fileInfo[0];
        if (fileInfo?.length > 0) {
            const file = fileInfo[0];
            const fileSplit = fileInfo[0].name.split(".");
            const fileExt = fileSplit[1].toLowerCase();

            console.log("파일명: " + fileInfo[0].name + " 파일확장자." + fileExt);
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

            console.log("파일명: " + fileInfo[0].name + " 파일확장자." + fileExt);
            if (fileExt === "jpg" || fileExt === "gif" || fileExt === "png") {
                setImageUrl(URL.createObjectURL(fileInfo[0]));
            }

            setImageFile(file);
            updateRef.current.fileInput = file;
            setFileName(fileInfo[0].name);
        }
    };

    const deleteFileFnc = async () => {
        console.log("productId:  " + productId);
        //productId: 23
        const res: IPostResultMessageResponse = await postDeleteFileApi(ProductInfo.deleteFile, {
            productId: productId,
        });
        alert(res);

        if (res.result === "success") {
            alert("파일을 삭제 하였습니다.");
            setImageUrl(null);
        }
    };

    const goUpdate = async () => {
        const formData = toRequestDto();
        console.log(productDetail);
        logFormData(formData);

        // //productId: 23
        const res: IPostResultMessageResponse = await postUpdateProductInfoApi(ProductInfo.updateProductInfo, formData);

        if (res.result === "success") {
            alert("제품 정보를 수정하였습니다.");
            setUpdateModal(!updateModal);
            navi("/react/management/product-info");
            setSearchKeyword({
                currentPage: 1,
                pageSize: 5,
                searchKeyword: "",
                searchOption: "searchAll",
            });
        } else {
            alert("잠시후다시 시도해주세요");
            setUpdateModal(!updateModal);
            navi("/react/management/product-info");
        }
    };

    const toRequestDto = () => {
        // updateRef의 값들을 FormData로 변환
        const formData = new FormData();
        updateRef.current.productId = productDetail.productId;
        updateRef.current.name = productDetail.name;
        updateRef.current.productNumber = productDetail.productNumber;
        updateRef.current.sellPrice = productDetail.sellPrice;
        updateRef.current.description = productDetail.description;
        // updateRef.current.supplierName = productDetail.supplyId;
        // updateRef.current.category = productDetail.categoryCode;
        updateRef.current.fileInput = imageFile;
        updateRef.current.supplyId = productDetail.supplyId;
        // updateRef.current.categoryCode = productDetail.categoryCode;
        updateRef.current.empty = "empty";
        // updateRef에서 필요한 값들을 하나씩 추가합니다.
        formData.append("productId", String(updateRef.current.productId));
        formData.append("name", updateRef.current.name);
        formData.append("productNumber", updateRef.current.productNumber);
        formData.append("sellPrice", String(updateRef.current.sellPrice));
        formData.append("description", updateRef.current.description);
        formData.append("supplierName", String(updateRef.current.supplierName));
        formData.append("category", updateRef.current.category);
        formData.append("supplyId", String(updateRef.current.supplyId));
        formData.append("categoryCode", updateRef.current.categoryCode);
        formData.append("empty", updateRef.current.empty);

        // 파일이 존재하면 FormData에 파일도 추가
        if (imageFile) {
            formData.append("file", imageFile); // file은 formData에 추가하는 키입니다.
        }

        // FormData 객체를 반환
        return formData;
    };

    const logFormData = (formData: FormData) => {
        formData.forEach((value, key) => {
            console.log(`${key}: ${value}`);
        });
    };

    const goInsert = async () => {
        console.log(insertProductDetail);
        emptyCheckFnc();
        const formData = toInsertRequestDTO();
        logFormData(formData);
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

    const emptyCheckFnc = () => {
        for (var key in emptyCheck) {
            if (insertProductDetail[key] === "" || insertProductDetail[key] < 0) {
                alert(emptyCheck[key]);
                return;
            }
        }
    };

    const toInsertRequestDTO = () => {
        const formData = new FormData();
        // insertProductDetail의 값들을 FormData에 추가
        formData.append("name", insertProductDetail.name);
        formData.append("productNumber", insertProductDetail.productNumber);

        // supplyId와 sellPrice를 문자열로 변환하여 추가
        formData.append("sellPrice", String(insertProductDetail.sellPrice)); // sellPrice를 string으로 변환
        formData.append("description", insertProductDetail.description);
        formData.append("supplierName", insertProductDetail.supplierName);
        formData.append("category", insertProductDetail.category);

        // supplyId를 string으로 변환하여 추가
        formData.append("supplyId", String(insertProductDetail.supplyId)); // supplyId를 string으로 변환
        formData.append("categoryCode", insertProductDetail.categoryCode);
        // fileInput이 존재하는 경우 파일을 FormData에 추가
        if (imageFile) {
            formData.append("file", imageFile); // file은 formData에 추가하는 키입니다.
        }
        // insertProductDetail의 값들을 FormData에 추가

        return formData;
    };

    const goDetateProduct = async () => {
        const res: IPostResultMessageResponse = await postDeleteProductInfoApi(ProductInfo.deleteProductInfo, {
            productId: productId,
        });

        if (res.result === "success") {
            alert("제품정보를 삭제 하였습니다.");
            setUpdateModal(!updateModal);
            setSearchKeyword({
                currentPage: 1,
                pageSize: 5,
                searchKeyword: "",
                searchOption: "searchAll",
            });
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
                                {/* setInsertProductDetail */}
                                {productDetail !== undefined ? <></> : <></>}

                                {productDetail !== undefined ? (
                                    <>
                                        <StyledInput
                                            type='text'
                                            className='inputTxt p100'
                                            name='name'
                                            id='name'
                                            onChange={updateInputHandler}
                                            value={productDetail?.name}
                                        />
                                    </>
                                ) : (
                                    <>
                                        <StyledInput
                                            type='text'
                                            className='inputTxt p100'
                                            name='name'
                                            id='name'
                                            onChange={inserInputHandler}
                                            value={insertProductDetail?.name}
                                        />
                                    </>
                                )}
                            </td>
                        </tr>
                        <tr>
                            <th scope='row'>
                                제품번호 <span className='font_red'>*</span>
                            </th>
                            <td colSpan={3}>
                                {productDetail !== undefined ? (
                                    <>
                                        <StyledInput
                                            type='text'
                                            className='inputTxt p100'
                                            name='productNumber'
                                            value={productDetail?.productNumber}
                                            onChange={updateInputHandler}
                                            id='productNumber'
                                        />
                                    </>
                                ) : (
                                    <>
                                        <StyledInput
                                            type='text'
                                            className='inputTxt p100'
                                            name='productNumber'
                                            onChange={inserInputHandler}
                                            value={insertProductDetail?.productNumber}
                                            id='productNumber'
                                        />
                                    </>
                                )}
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
                                            value={productDetail?.sellPrice}
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
                                {productDetail !== undefined ? (
                                    <>
                                        <StyledInput
                                            type='text'
                                            className='inputTxt p100'
                                            name='description'
                                            value={productDetail?.description}
                                            onChange={updateInputHandler}
                                            id='description'
                                        />
                                    </>
                                ) : (
                                    <>
                                        <StyledInput
                                            type='text'
                                            className='inputTxt p100'
                                            name='description'
                                            onChange={inserInputHandler}
                                            value={insertProductDetail?.description}
                                            id='description'
                                        />
                                    </>
                                )}
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
                                        <select name='supplyId' id='supplier' onChange={insertSupplierHandler}>
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
                                        <select
                                            name='category'
                                            id='category'
                                            value={productDetail?.category}
                                            onChange={updateCategoryHandler}
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
                                    </>
                                ) : (
                                    <>
                                        <select name='category' id='category' onChange={insertCateHandler}>
                                            {categoryList.map((ele, index) => {
                                                const supplyId = ele.supplyId === 0 ? uuidv4() : ele.supplyId; // uuid를 사용하여 고유값 생성
                                                const optionKey = `${supplyId}-${index}`; // supplyId와 index를 조합
                                                return (
                                                    <option
                                                        key={optionKey}
                                                        value={ele.categoryCode}
                                                        data-supplyid={ele.supplyId}
                                                    >
                                                        {ele.category}
                                                    </option>
                                                );
                                            })}
                                        </select>
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
                                    {imageUrl ? (
                                        <>
                                            {/* <StyledInput type='file' className='inputTxt p80' name='fileInput' id='fileInput' /> */}
                                        </>
                                    ) : (
                                        // inserthandlerFile
                                        <>
                                            {productDetail !== undefined ? (
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
                                            ) : (
                                                <>
                                                    <StyledInput
                                                        type='file'
                                                        id='fileInput'
                                                        style={{ display: "none" }}
                                                        name='file'
                                                        onChange={inserthandlerFile}
                                                    ></StyledInput>
                                                    <label className='img-label' htmlFor='fileInput'>
                                                        파일 첨부하기
                                                    </label>
                                                </>
                                            )}
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
                            {/* logicalPath */}
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
                <div className='btn_areaC mt30'>
                    {productDetail !== undefined ? (
                        <>
                            <StyledButton onClick={goUpdate}>수정</StyledButton>
                            <StyledButton onClick={goDetateProduct}>삭제</StyledButton>
                        </>
                    ) : (
                        <>
                            <StyledButton onClick={goInsert}>저장</StyledButton>
                        </>
                    )}
                    <StyledButton
                        onClick={() => {
                            productDetail !== undefined ? setUpdateModal(!updateModal) : setModal(!modal);
                        }}
                    >
                        취소
                    </StyledButton>
                </div>
            </div>
        </UserInfoModalStyle>
    );
};
