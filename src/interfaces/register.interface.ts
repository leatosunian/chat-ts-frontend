export default interface RegisterInterface {
    name: string
    email: string;
    password: string;
    confirmPass: string;
    phone: number | undefined;
    userInfo: string 
}