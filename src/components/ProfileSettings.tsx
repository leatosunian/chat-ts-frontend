import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import axiosReq from "../config/axios"

type settingsProps = {
    userId: string | undefined;
}

type userData = {
    name: string,
    userInfo: string,
    phone: number | undefined,
}

const ProfileSettings: React.FC<settingsProps> = ({userId}) => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState<userData>({
        name: '',
        userInfo: '',
        phone: undefined,
    })

    const userID = localStorage.getItem('typechat_userId')
    const token = localStorage.getItem('typechat_token')
    const authHeader = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    }

    const getProfileData = async () => {
        try {
            const response = await axiosReq.get('/user/getdata/'+userID, authHeader)
            setUserData(response.data.response_data)
        } catch (error) {
            console.log(error)
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        try {
            const response = await axiosReq.put('/user/update', userData, authHeader)  
            setUserData(response.data.response_data)
                      
        } catch (error) {
            console.log(error);
        }

    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserData({...userData, [e.target.name]: e.target.value})
    }

    const logOut = () => {
        localStorage.removeItem('typechat_userId');
        localStorage.removeItem('typechat_token');
        navigate('/login')
    }

    useEffect(() => {
      getProfileData()
    
    }, [userId])

  return (
    <div className="absolute text-white mainContSettings w-72 h-fit ">
        <div className="flex flex-col items-center gap-5">
            <div className="">
                <img className="w-16" src="../../public/assets/user.png" alt="" />
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
  )
}

export default ProfileSettings