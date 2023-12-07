import { useState } from "react"
import LoginInterface from "../interfaces/login.interface"
import axiosReq from '../config/axios.jsx'
import Alert from "../components/Alert.js"
import AlertInterface from "../interfaces/alert.interface.js"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth.js"


const Login: React.FC = () => {
    const [inputValues, setInputValues] = useState<LoginInterface>()
    const [ alert, setAlert ] = useState<AlertInterface>()
    const navigate = useNavigate()
    const { saveAuthData } = useAuth()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        // FORM VALIDATIONS //        
        if( !inputValues?.email){
            handleAlert({ msg: "Ingresá un correo válido", error: true, alertType: 'ERROR_ALERT'});
            hideAlert()
            return;
        }
        if( !inputValues?.password ){
            handleAlert({ msg: 'Debes ingresar tu contraseña', error: true, alertType: 'ERROR_ALERT' });
            hideAlert()
            return;
        } 
        if(`${inputValues?.password}`.length < 6){
            handleAlert({ msg: 'Formato de contraseña incorrecta', error: true, alertType: 'ERROR_ALERT' });
            hideAlert()
            return;
        }
        if(inputValues == undefined){
            handleAlert({error: true, alertType: 'ERROR_ALERT', msg: 'Todos los campos son obligatorios'});
            hideAlert()
            return;
        }
        handleAlert({msg:'', error: false, alertType: 'ERROR_ALERT'});

        // LOGIN REQUEST //
        const response = await axiosReq.post('/user/login', inputValues);
        console.log(response.data.response_data);
        if(response.data.response_data === 'USER_NOT_FOUND'){
            handleAlert({error: true, alertType: 'ERROR_ALERT', msg: 'El usuario no existe'});
            hideAlert()
            return;
        }
        if(response.data.response_data === 'WRONG_PASSWORD'){
            handleAlert({error: true, alertType: 'ERROR_ALERT', msg: 'Contraseña incorrecta'});
            hideAlert()
            return;
        }
        // USER DATA STORAGE //

        const loginData = {
            userID: response.data.response_data.userId,
            token: response.data.response_data.loginToken
        }

        localStorage.setItem('typechat_token', loginData.token)
        localStorage.setItem('typechat_userId', loginData.userID) 

        saveAuthData(loginData)

        navigate('/home')      
    }

    const hideAlert = () => {
        setTimeout(() => {
            handleAlert({error: false, alertType: 'ERROR_ALERT', msg: ''});
        }, 3000);
    }

    const handleAlert = (e:AlertInterface) => {
        setAlert(e)
    }

    const handleRegister = () => {
        navigate('/register')
    }
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValues({...inputValues, [e.target.name]: e.target.value})
    }


    
    return (
        <div className="flex w-screen h-screen">
            <div className="flex justify-center w-1/2 h-screen ">
                <img src="../assets/images/tcsquare1.png" className="w-64 h-40 loginImg" alt="" />
            </div>

            <div className="flex justify-center w-1/2 h-screen">
                <div className="loginCont">
                    <div className="loginHeader">
                        <h3 className="mb-3 text-2xl font-semibold ">Iniciar Sesión</h3>
                        <span className="text-sm text-center">¡Accedé a tu cuenta para comenzar a chatear!</span>
                    </div>

                    <form onSubmit={handleSubmit} className="loginForm">
                        <div className="loginFormInput">
                            <span className="text-sm">Correo electrónico</span>
                            <input 
                                value={inputValues?.email}
                                onChange= {handleChange} 
                                type="email" 
                                name="email"
                            />
                        </div>
                        <div className="loginFormInput">
                            <span className="text-sm">Contraseña</span>
                            <input 
                                value={inputValues?.password}
                                onChange= {handleChange} 
                                type="password" 
                                name="password"
                             />
                        </div>
                        <span className="text-sm cursor-pointer" onClick={handleRegister}>No tenes cuenta? Hacé click para <b>registrarte</b>.</span>
                        <button>Ingresar</button>
                    </form>

                    {
                        alert?.error &&
                        <Alert error= {alert?.error} msg={alert?.msg} alertType={alert?.alertType} />
                    }
                    
                </div>
            </div>
        </div>
    )
}

export default Login