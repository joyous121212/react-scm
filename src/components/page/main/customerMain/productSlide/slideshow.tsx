import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { GoChevronLeft, GoChevronRight } from "react-icons/go";
import { CardWrapper, SliderContainer } from "./styled";
import { searchApi } from "../../../../../api/CommonCodeApi/searchApi";
import { IMainProductsListBodyResponse, IProductsDetail } from "../../../../../models/interface/IProducts";
import { Products } from "../../../../../api/api";
import noImage from "../../../../../assets/noImage.jpg";
import { Spinner } from "../../../../common/Spinner/spinner";

// 화살표 props 타입 정의
interface ArrowProps {
    className?: string;
    style?: React.CSSProperties;
    onClick?: () => void;
}

const LeftArrow = GoChevronLeft as unknown as React.FC;
const RightArrow = GoChevronRight as unknown as React.FC;
// 이전 버튼 (왼쪽 화살표)
const CustomPrevArrow: React.FC<ArrowProps> = ({ className, onClick }) => {
    return (
        <div className={className} onClick={onClick}>
            <LeftArrow />
        </div>
    );
};

// 다음 버튼 (오른쪽 화살표)
const CustomNextArrow: React.FC<ArrowProps> = ({ className, onClick }) => {
    return (
        <div className={className} onClick={onClick}>
            <RightArrow />
        </div>
    );
};

// 슬라이드 쇼 컴포넌트
export const ProductSlideshow: React.FC = () => {
    const [productsList, setProductsList] = useState<IProductsDetail[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    useEffect(() => {
        searchProductsList();
    }, []);

    const searchProductsList = async (currentPage?: number) => {
        setIsLoading(true);
        try {
            const result = await searchApi<IMainProductsListBodyResponse>(Products.searchMainProductList, {
                searchKeyword: "",
                searchOption: "searchAll",
                currentPage: 1,
                pageSize: 10000,
            });

            if (result) {
                console.log(result.productList);
                setProductsList(result.productList);
            }
        } catch (error) {
            console.error("Error fetching shopping orders:", error);
        } finally {
            setIsLoading(false);
        }
    };
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 2,
        slidesToScroll: 2,
        nextArrow: <CustomNextArrow />,
        prevArrow: <CustomPrevArrow />,
        autoplaySpeed: 3000,
    };

    return (
        <>
            {!productsList ? null : (
                <SliderContainer>
                    {isLoading ? (
                        <Spinner />
                    ) : (
                        <Slider {...settings}>
                            {productsList?.map((product, index) => (
                                <CardWrapper key={index}>
                                    <div className='row g-0'>
                                        <div className='col-md-4'>
                                            <img
                                                src={product.logicalPath ? product.logicalPath : noImage}
                                                className='img-fluid rounded-start'
                                                alt={product.name}
                                            />
                                        </div>
                                        <div className='col-md-8'>
                                            <div className='card-body'>
                                                <h5 className='card-title'> 제품명 : {product.name}</h5>
                                                <h5 className='card-text'>가격 : {product.sellPrice}</h5>
                                                <p className='card-text'>
                                                    <small className='text-body-secondary'>
                                                        상품설명: {product.description}
                                                    </small>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </CardWrapper>
                            ))}
                        </Slider>
                    )}
                </SliderContainer>
            )}
        </>
    );
};
