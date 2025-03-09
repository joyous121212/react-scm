import React, { forwardRef } from "react";
import { StyledInputStyled } from "../../../../common/StyledInput/styled";

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
    variant?: "default" | "outline" | "filled";
    size?: "small" | "medium" | "large" | "modal"; // ✅ 우리가 원하는 `size` 타입
    fullWidth?: boolean;
    error?: boolean;
    as?: string;
    value?: string | number;  // value 추가
}

export const UserInfoStyledInput = forwardRef<HTMLInputElement, InputProps>(
    ({ as = "input", value, ...props }, ref) => {
        return <StyledInputStyled as={as} ref={ref} value={value} {...props} />;
    }
);
