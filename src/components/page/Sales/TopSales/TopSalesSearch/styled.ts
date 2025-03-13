import styled from "styled-components";

export const TopSalesSearchStyled = styled.div`
    display: flex;
    gap: 5px;
    align-items: center;
    justify-content: flex-end;
    margin-top: 5px;

    .searchYear, .searchMonth {
	    padding: 10px;
        font-size: 16px;
        border-radius: 6px;
        border: 1px solid #ccc;	    
	}

    .searchYear{
		width: 110px; 
		margin-right: 5px; 
	    margin-left: 10px;
	}
	.searchMonth{
		width: 90px;
		margin-right: 10px; 
	}
`;
