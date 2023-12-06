import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import axiosReq from "../config/axios"
import { useAuth } from "../hooks/useAuth";
import Spinner from "./Spinner";
import { useAnimate } from 'framer-motion';

type settingsProps = {
    userId: string | undefined;
    refreshProfile: () => void;
}

type userData = {
    name: string,
    userInfo: string,
    phone: number | undefined,
    profileImage: string
}

const ProfileSettings: React.FC<settingsProps> = ({userId, refreshProfile}) => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState<userData>({
        name: '',
        userInfo: '',
        phone: undefined,
        profileImage:''
    })

    const [loading, setLoading] = useState(true)
    const [scope, animate] = useAnimate()
    const { saveAuthData } = useAuth()

    const userID = localStorage.getItem('typechat_userId')
    const token = localStorage.getItem('typechat_token')
    const authHeader = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    }
    const formAuthHeader = {
        headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${token}`
        }
    }

    const getProfileData = async () => {
        try {
            const response = await axiosReq.get('/user/getdata/'+userID, authHeader)
            setUserData(response.data.response_data)
            refreshProfile();
            setLoadingTimeout()
        } catch (error) {
            console.log(error)
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        try {
            const response = await axiosReq.put('/user/update', userData, authHeader)  
            setUserData(response.data.response_data)
            refreshProfile();
            setLoadingTimeout()
            animate(scope.current, {opacity: 0 },  {duration: .7})     
                      
        } catch (error) {
            console.log(error);
        }

    }

    const setLoadingTimeout = () => {
        animate(scope.current, {opacity: 0 },  {duration: .5}) 
        setTimeout(() => {
            setLoading(false)
        }, 500);
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserData({...userData, [e.target.name]: e.target.value})
    }

    const logOut = () => {
        localStorage.removeItem('typechat_userId');
        localStorage.removeItem('typechat_token');
        saveAuthData({
            userID: '',
            token: ''
        })
        navigate('/login')
    }

    const handleClick = () => {
        const fileInput = document.querySelector('.inputField') as HTMLElement
        if(fileInput != null){
            fileInput.click()
        }
    }

    const handleFileInput = async (e:React.ChangeEvent<HTMLInputElement>) => {
        let image
        if(e.target.files?.length != undefined){
            image = e.target.files[0]
            if(image.type == 'image/jpeg' || image.type == 'image/png' || image.type == 'image/webp' || image.type == 'image/jpg'){
                updateProfileImage(image)
            } else {
                console.log('file is not an image');
            }
        } 
    }

    const updateProfileImage = async (image: File) => {
        const formData = new FormData();
        formData.append('profile-image', image);

        try {
            await axiosReq.post('/user/update/profile-pic', formData, formAuthHeader);
            refreshProfile();
            getProfileData();
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        setLoading(true)
        getProfileData()
    }, [userId])

        return (
            <>
                
                { loading &&
                    <div ref={scope} className="absolute z-40 text-white mainContSettings" style={{width: '288px', height:'390px'}}>
                        <Spinner/>                
                    </div>
                }

                <div className="absolute z-30 text-white mainContSettings w-72 h-fit ">
                    <div className="flex flex-col items-center gap-5">
                        <div onClick={ handleClick } className="rounded-full inputFileForm" title="Cambiar foto de perfil" >
                            <img className="w-16 rounded-full" src={'http://localhost:4000/api/user/getprofilepic/'+userData.profileImage} alt="" />
                            <input onChange={handleFileInput} type="file" className="inputField" accept="image/*" hidden />
                        </div>

                        <div>
                            <form onSubmit={handleSubmit} action="" className="flex flex-col items-center gap-2 ">
                                <div className="flex flex-col">
                                    <span className="text-xs">Nombre de usuario</span>
                                    <input  className=" bg-zinc-900 rounded-lg py-0.5 px-2 text-sm" onChange= {handleChange} value={userData?.name} name="name" type="text" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs">Estado</span>
                                    <input  className=" bg-zinc-900 rounded-lg py-0.5 px-2 text-sm" onChange= {handleChange} value={userData?.userInfo} name="userInfo" type="text" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs">Número de teléfono</span>
                                    <input  className=" bg-zinc-900 rounded-lg py-0.5 px-2 text-sm" onChange= {handleChange} value={userData?.phone} name="phone" type="number" />
                                </div>
                                <button className="px-3 py-1 mt-3 text-sm rounded-xl bg-zinc-900 w-fit h-fit">Guardar cambios</button>
                            </form>
                            <button onClick={logOut} className="px-2 py-2 mx-auto mt-3 text-sm bg-red-900 rounded-xl w-fit h-fit">
                                <img className="w-4 mx-auto my-auto" src="../../public/assets/logout.png" alt="" />
                            </button>
                        </div>
                    </div>
                </div>
            </>
        )
}

export default ProfileSettings