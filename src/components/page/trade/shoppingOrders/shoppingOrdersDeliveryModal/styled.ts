import styled from "styled-components";

export const ShoppingOrdersDeliveryModalStyled = styled.div`
    width: 100%;
    height: 100%;
    position: fixed;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, 0.5);
    z-index: 10;
    font-weight: bold;

    .container {
        background: white;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.25);
        width: auto;
    }

    .warehouseSelect {
        margin-top: 10px;
        margin-left: 30px;
        display: block;
    }

    .warehouseList {
        margin-top: 50px;
    }

    label {
        margin-top: 10px;
        display: block; /* ✅ label이 블록 요소로 동작하도록 변경 */
    }
    dt {
        font-size: 20px;
        font-weight: bold;
        margin-bottom: 10px;
        background-color: #3498db;
        color: white;
        padding: 10px; /* 텍스트와 배경 사이 간격 추가 */
        border-radius: 6px; /* 둥근 모서리 효과 */
    }

    table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 10px;
    }

    th,
    td {
        border: 1px solid #ddd;
        padding: 10px;
        text-align: center;
    }

    th {
        background: #f4f4f4;
        text-align: center;
    }

    .product-image {
        width: 100px;
        height: 100px;
        object-fit: contain;
        border: 1px solid #ddd;
        background: white;
    }

    .text-area {
        width: 100%;
        height: 60px;
        padding: 8px;
        border: 1px solid #ccc;
        border-radius: 4px;
        resize: none;
    }

    .button-container {
        display: flex;
        justify-content: flex-end; /* ✅ 버튼을 오른쪽 정렬 */
        margin-top: 10px;
    }

    button {
        margin-left: 10px;
    }

    span {
        margin-left: 15px;
        margin-right: 5px;
    }
`;
