export type TypeNullCheck = {
    inval?: string | number;
    msg?: string;
};

export const nullCheck = (checklist: TypeNullCheck[]) => {
    let errorMessages: string = ""
    let coptlist = [...checklist];
    let checksize = coptlist.length;

    for (let i = 0; i < checksize; i++) {
        let item = coptlist[i];

        let checkflag = false;

        if (typeof item.inval === "string") {
            checkflag = item.inval !== "" && item.inval !== null && item.inval !== undefined ? true : false;
            if (item.inval.length > 20) {
                errorMessages = `20자 이하만 입력 가능합니다.`;
                checkflag = false;
            }
        } else if (typeof item.inval === "number") {
            checkflag = item.inval !== 0 ? true : false;
        }

        if (!checkflag) {
            alert(errorMessages? errorMessages:item.msg);
            return false;
        }
    }

    return true;
};
