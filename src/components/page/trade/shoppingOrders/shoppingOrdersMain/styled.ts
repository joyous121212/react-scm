import styled from "styled-components";

export const ShoppingOrdersMainStyled = styled.div`
    table {
        width: 100%;
        border-collapse: collapse;
        margin: 25px 0;
    }

    .orderButton {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    table,
    th,
    td {
        border: 1px solid #ddd;
    }

    th,
    td {
        padding: 13px;
        text-align: center;
        font-size: 12px;
    }

    th {
        background-color: #f4f4f4;
        font-weight: bold;
    }

    tr:hover {
        background-color: #f1f1f1;
    }

    .td-pointer:hover {
        cursor: pointer;
        text-decoration: underline;
    }
`;
