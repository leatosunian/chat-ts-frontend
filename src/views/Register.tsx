import { useState } from "react"
import RegisterInterface from "../interfaces/register.interface"
import Alert from "../components/Alert.js"
import AlertInterface from "../interfaces/alert.interface.js"
import axiosReq from "../config/axios.js"
import { useNavigate } from "react-router-dom";
const Register = () => {

    const [inputValues, setInputValues] = useState<RegisterInterface>({
        name: '',
        email: '',
        password: '',
        confirmPass: '',
        phone: undefined,
        userInfo: 'Hi! I am a new user.'
    })
    const [ alert, setAlert ] = useState<AlertInterface>()
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValues({...inputValues, [e.target.name]: e.target.value})
        
    }
    
    const handleAlert = (e:AlertInterface) => {
        setAlert(e)
    }

    const handleLogin = () => {
        navigate('/login')
    }
    
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
        if( !inputValues?.name ){
            handleAlert({ msg: 'Debes ingresar tu nombre', error: true, alertType: 'ERROR_ALERT' });
            hideAlert()
            return;
        } 
        if( inputValues?.confirmPass !== inputValues?.password ){
            handleAlert({ msg: 'Las contraseñas no coinciden', error: true, alertType: 'ERROR_ALERT' });
            hideAlert()
            return;
        }
        if( !inputValues?.phone ){
            handleAlert({ msg: 'Debes ingresar tu teléfono', error: true, alertType: 'ERROR_ALERT' });
            hideAlert()
            return;
        } 
        if( inputValues == undefined ){
            handleAlert({error: true, alertType: 'ERROR_ALERT', msg: 'Todos los campos son obligatorios'});
            hideAlert()
            return;
        }
        hideAlert()

        // REGISTER REQUEST //
        const response = await axiosReq.post('/user/create', inputValues);
        console.log(response.data.response_data);
        if(response.data.response_data === 'USER_EXISTS'){
            handleAlert({error: true, msg: 'El usuario ya existe.', alertType: 'ERROR_ALERT'});
            hideAlert()
            return;
        }

        handleAlert({error: true, msg: 'Usuario creado! Iniciá sesión para chatear.', alertType: 'OK_ALERT'});
        hideAlert()
              
    }

    const hideAlert = () => {
        setTimeout(() => {
            handleAlert({error: false, alertType: 'ERROR_ALERT', msg: ''});
        }, 3000);
    }
    
  return (
    <div className="flex w-screen h-screen">

        {
            alert?.error &&
            <Alert error= {alert?.error} msg={alert?.msg} alertType={alert?.alertType} />
        }

        <div className="flex justify-center w-1/2 h-screen ">
            <img src="../assets/images/tcsquare1.png" className="w-64 h-40 loginImg" alt="" />
        </div>

        <div className="flex justify-center w-1/2 h-screen">
            <div className="loginCont">
                <div className="loginHeader">
                    <h3 className="mb-3 text-2xl font-semibold ">Registrate</h3>
                    <span className="text-sm text-center">¡Creá tu cuenta para comenzar a chatear!</span>
                </div>

                <form onSubmit={handleSubmit} className="loginForm">
                    <div className="loginFormInput">
                        <span className="text-sm">Nombre</span>
                        <input 
                            value={inputValues?.name}
                            onChange= {handleChange} 
                            type="text" 
                            name="name"
                        />
                    </div>
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
                    <div className="loginFormInput">
                        <span className="text-sm">Repetir contraseña</span>
                        <input 
                            value={inputValues?.confirmPass}
                            onChange= {handleChange} 
                            type="password" 
                            name="confirmPass"
                        />
                    </div>
                    <div className="loginFormInput">
                        <span className="text-sm">Teléfono</span>
                        <input 
                            value={inputValues?.phone}
                            onChange= {handleChange} 
                            type="number" 
                            name="phone"
                        />
                    </div>
                    
                    <span className="text-sm cursor-pointer" onClick={handleLogin}>Ya creaste tu cuenta? Hacé click para <b>iniciar sesión</b>.</span>

                    <button>Crear usuario</button>
                </form>
                
            </div>
        </div>
    </div>
  )
}

export default Register