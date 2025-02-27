import { Button } from "react-bootstrap";
import { StyledButton } from "../../../../common/StyledButton/StyledButton";
import { StyledInput } from "../../../../common/StyledInput/StyledInput";
import { NoticeSearchStyled } from './styled';

export const NoticeSearch = () => {
    return (
        <NoticeSearchStyled>
            <StyledInput></StyledInput>
            <StyledInput type='date'></StyledInput>
            <StyledInput type='date'></StyledInput>
            <StyledButton variant='secondary'>검색</StyledButton>
            <StyledButton>등록</StyledButton>
        </NoticeSearchStyled>
    );
};
