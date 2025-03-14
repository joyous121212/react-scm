import styled from "styled-components";

export const OrdersReturnListModalStyled = styled.div`
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
    }

    th,
    td {
        border: 1px solid #ddd;
        padding: 10px;
        text-align: left;
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
        box-sizing: border-box;
    }

    .button-container {
        display: flex;
        justify-content: space-between;
        margin-top: 10px;
        width: 100%;
    }

    button {
        flex: 1;
        background-color: #3bb2ea;
        border: none;
        color: white;
        padding: 10px;
        margin: 0 5px;
        font-size: 16px;
        cursor: pointer;
        border-radius: 6px;
        box-shadow: 0 2px #999;
        transition: 0.3s;
        white-space: nowrap;

        &:hover {
            background-color: #45a049;
        }

        &:active {
            background-color: #3e8e41;
            box-shadow: 0 2px #666;
            transform: translateY(2px);
        }
    }

    /* 발주서 전송 완료 상태일 때 */
    .submitted {
        background-color: #45a049 !important; /* 초록색 */
        cursor: default !important;
        pointer-events: none !important;
        box-shadow: none !important;
    }

    .font_red {
        color: #fe1414;
    }
`;
