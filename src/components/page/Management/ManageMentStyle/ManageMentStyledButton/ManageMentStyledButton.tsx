import { FC } from "react";
import { ManageMentStyledButtonStyle } from "./ManageMentStyledButtonStyle";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "danger";
    size?: "small" | "medium" | "large" | "close";
    fullWidth?: boolean;
}

export const ManageMentStyledButton: FC<ButtonProps> = ({ children, ...props }) => {
    return <ManageMentStyledButtonStyle {...props}>{children}</ManageMentStyledButtonStyle>;
};
