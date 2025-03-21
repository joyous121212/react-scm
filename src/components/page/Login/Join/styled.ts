import styled from "styled-components";

export const JoinStyled = styled.div`
    width: 100%;
    height: 100%;
    position: fixed;
    display: flex;
    top: 0;
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
        width: 150px;
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

        &:hover {
            background-color: #45a049;
        }

        &:active {
            background-color: #3e8e41;
            box-shadow: 0 2px #666;
            transform: translateY(2px);
        }
    }

    .signtitle{
         text-align: center;
         margin-bottom: 25px;
         font-size: 200%;
    }

    .checkButton{
        width: 142px;
        height: 25px; 
        marginRight: 0px;
    }
    
    .findTitle{
        text-align: center;
        margin-bottom: 25px;
    }

    .findCheckButton{
        width:85px;
        height: 25px;
    }

    .bottomButtonArea{
        text-align: center;
        margin-top: 15px;
    }

    .cancelButton{
         background-color:rgb(234, 59, 59);
         &:hover {
            background-color: rgb(170, 12, 12);
            
        }
            &:active {
            background-color: rgb(170, 12, 12);
            box-shadow: 0 2px #666;
            transform: translateY(2px);
        }
    }

    .font_red {
        color: #fe1414;
    }

    .findTitle {
        cursor: pointer;
    }

    select, .joinDate {
        padding: 5px;
        font-size: 14px;
        border-radius: 6px;
        border: 1px solid #ccc;
        background-color: "#3498db"
        width: "80px"
        cursor: pointer;
        transition: all 0.3s ease-in-out;
    }
    joinInput{
        padding: 6px 10px; font-size: 14px; width:355px;
    }


    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.15s ease;
    }

    .modal-overlay.fade-in {
        opacity: 1;
        visibility: visible;
    }

    .modal-overlay.fade-out {
        opacity: 0;
        visibility: hidden;
    }

    .modal-content {
        background-color: white;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
    }
`;
