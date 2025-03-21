import styled from "styled-components";

export const SliderContainer = styled.div`
    width: 94%;
    height: 240px;
    margin-top: 25px;
    padding: 20px 40px 20px 0px; /* ✅ 왼쪽만 40px */
    .slick-list {
        width: 1130px;
    }
    .slick-prev:before,
    .slick-next:before {
        display: none;
    }
`;

export const CardWrapper = styled.div`
    max-width: 530px;
    background: white;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

    .row {
        display: flex;
        flex-wrap: nowrap;
    }

    .col-md-4 {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .col-md-8 {
        flex: 2;
    }

    .card-body {
        margin-left: 10px;
        padding: 10px;
    }

    img {
        width: 230px;
        height: 230px;
        object-fit: cover;
        border-radius: 8px 0 0 8px;
    }

    .text-area {
        margin-top: 10px;
        font-size: 16px;
        width: 100%;
    }
`;
