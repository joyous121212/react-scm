export interface IGetRole {
    userType: "" | "S" | "C" | "D" | "T" | "E";
}
export interface IGetRoleResponse {
    userType: IGetRole;
}
