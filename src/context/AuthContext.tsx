import { createContext } from 'react';
import { IAuthContextState } from '../interfaces/auth.interface';

export type authContextProps = {
    authState: IAuthContextState,
    saveAuthData: (loginData: IAuthContextState) => void,
    loading: boolean
}

export const AuthContext = createContext<authContextProps>({} as authContextProps)










































