import { IAuthContextState } from "../interfaces/auth.interface";

type authAction = 
    | { type: 'saveAuthData', payload: IAuthContextState }

export const authReducer = (state: IAuthContextState, action: authAction) => {
    switch (action.type) {
        case 'saveAuthData':
            return { ...state, userID: action.payload.userID, token: action.payload.token  }            
    
        default:
            return state;
    }
}