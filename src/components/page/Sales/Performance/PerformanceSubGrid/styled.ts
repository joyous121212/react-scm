import styled from 'styled-components';

export const PerformanceModalStyled = styled.div`
    margin-top: 140px;

    .closeButton {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 10px;
    }
        
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

    tr:hover {
        background-color: #f1f1f1;
    }

    .td-pointer:hover {
        cursor: pointer;
        text-decoration: underline;
    }
`;
