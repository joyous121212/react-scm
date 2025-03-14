import styled from "styled-components";

export const OrdersReturnListMainStyled = styled.div`
    table {
        width: 100%;
        border-collapse: collapse;
        margin: 50px 0;
    }

    table,
    th,
    td {
        border: 1px solid #ddd;
    }

    th,
    td {
        padding: 12px;
        text-align: center;
    }

    th {
        background-color: #f4f4f4;
        font-weight: bold;
    }

    /* 클릭 가능한 행에만 hover 효과를 추가 */
    .clickable-row:hover {
        background-color: #f1f1f1;
    }

    /* td-pointer에만 hover 효과 추가 */
    .td-pointer:hover {
        cursor: pointer;
        text-decoration: underline;
    }
`;
