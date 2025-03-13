import styled from "styled-components";

export const TopSalesMainStyled = styled.div`
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

    .divTopSalesList {
	    display: flex;
	    justify-content: space-between; /* 테이블과 차트를 나란히 정렬 */
	    align-items: center; /* 중앙 정렬 */
	    margin-top: 10px;
	    width: 100%;
	}

	.table-container {
	    flex: 1; /* 테이블과 차트가 동일한 비율로 차지 */
	    margin-right: 20px;
	}

    .performanceChart {
	    flex: 1; /* 차트도 동일한 비율로 차지 */
	    display: flex;
	    justify-content: center;
	    align-items: center;
	    max-width: 600px; 
	    height: auto;
	    min-height: 400px; /* 차트 크기가 너무 작아지지 않도록 설정 */
	    margin-left: 20px; 
	}
`;
