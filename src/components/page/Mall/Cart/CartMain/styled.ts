import styled from "styled-components";

export const CartMainStyled = styled.div`
    h3 {
        margin-bottom: 5px;
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

    img {
        width:60px; 
        height:60px;
    }

    .divTotAmt{
        width: 200px;
        text-align: right;
        padding-top: 20px;
        padding-bottom: 20px;
        float: right;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 10px;
	}

    .divTotAmt .totTitle{
		font-size: 16px;
		font-weight: bold;
	}

    .divOrder{
		padding-top: 20px;
		float: right;
	}

`;

const HorizonLine = styled.div`
  width: 100%;
  display: block;
  border-bottom: 1px solid #aaa;
  margin: 0 0 20px;
`;

export default HorizonLine;
