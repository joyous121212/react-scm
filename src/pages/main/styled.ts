import styled from "styled-components";

export const MainStyled = styled.div`
    align-items: center;
    margin-top: 30px;

    label {
        font-weight: bold;
        font-size: 20px;
    }

    .label-container {
        margin-top: 65px;
    }

    .slider-container {
        background-color: blue;
        width: 75%;
        position: relative;
    }

    .sliderItem {
        background-color: red;
        min-width: 200px; /* ✅ 강제로 최소 너비 적용 */
        height: 100px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: white;
        font-size: 18px;
    }

    /* ✅ 화살표 색상 변경 */
    .slick-prev,
    .slick-next {
        color: black !important;
        font-size: 30px !important;
    }

    /* ✅ 화살표 위치 조정 */
    .slick-prev {
        left: -40px !important;
        top: 30% !important; /* 🔺 화살표를 위쪽으로 이동 */
    }

    .slick-next {
        right: -40px !important;
        top: 30% !important; /* 🔺 화살표를 위쪽으로 이동 */
    }
`;
