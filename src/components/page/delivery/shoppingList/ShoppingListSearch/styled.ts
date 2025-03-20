import styled from "styled-components";

export const ShoppingListSearchStyled = styled.div`
    display: flex;
    gap: 5px;
    align-items: center;
    justify-content: flex-end;
    margin-top: 5px;

    .refresh-button {
        background: none;
        border: none;
        font-size: 16px;
        display: flex;
        align-items: center;
        cursor: pointer;
    }

    .refresh-icon {
        width: 16px;
        height: 16px;
        border: 2px solid #000;
        border-radius: 50%;
        border-top: 2px solid transparent;
        animation: spin 1s linear infinite;
        margin-right: 8px;
    }

    .reset {
        width: 30px;
        &:hover {
            cursor: pointer;
            animation: spin 1s linear infinite;
        }
    }
`;
