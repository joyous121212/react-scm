import styled from "styled-components";

export const ProfitCheckMainStyled = styled.div`
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

    .top-rank{
		background-color: #fdeed7; 
	    font-weight: bold;
	}

    .animate-text {
	    display: inline-block; 
	    animation: textScaleTwice 1s ease-in-out 2; 
	}

    @keyframes textScaleTwice {
	    0% { transform: scale(1); }
	    25% { transform: scale(1.2); } 
	    50% { transform: scale(1); } 
	    75% { transform: scale(1.2); } 
	    100% { transform: scale(1); }  
	}

    .selected {
        background-color: #f1f1f1;
    }
`;
