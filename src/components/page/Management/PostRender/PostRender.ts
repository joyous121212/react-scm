export const PostRender = <T>(param1: T, param2: React.Dispatch<React.SetStateAction<T>>): void => {
    console.log(param2);
    param2(param1);
};
