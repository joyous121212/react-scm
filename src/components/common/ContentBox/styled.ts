import styled from "styled-components";

// 불필요한 props를 DOM으로 전달하지 않도록 `shouldForwardProp` 사용
export const Box = styled.div.withConfig({
    shouldForwardProp: (prop) => !["variant", "fullWidth", "bordered", "fontSize"].includes(prop),
})<{ variant: string; fullWidth?: boolean; bordered?: boolean; fontSize?: string }>`
    padding: 20px;
    border-radius: 8px;
    ${({ fullWidth }) => fullWidth && "width: 100%;"}
    ${({ bordered }) => (bordered ? "border: 1px solid #ddd;" : "")}
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

    /* ✅ 배경색 & 글자색 설정 */
    background-color: ${({ variant }) =>
        variant === "primary"
            ? "#3498db"
            : variant === "danger"
              ? "#e74c3c"
              : variant === "success"
                ? "#2ecc71"
                : variant === "warning"
                  ? "#f39c12"
                  : variant === "info"
                    ? "#1abc9c"
                    : variant === "dark"
                      ? "#2c3e50"
                      : variant === "light"
                        ? "#ecf0f1"
                        : "#fff"};

    color: ${({ variant }) => (variant === "default" || variant === "light" ? "#333" : "#fff")};

    /* ✅ 글자 크기 설정 */
    font-size: ${({ fontSize }) => (fontSize === "small" ? "14px" : fontSize === "large" ? "20px" : "16px")};
`;

export const Title = styled.h2<{ fontSize?: string }>`
    margin: 0 0 10px;
    font-size: 18px;
    font-size: ${({ fontSize }) => (fontSize === "small" ? "16px" : fontSize === "large" ? "22px" : "18px")};
`;
