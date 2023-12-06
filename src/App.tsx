import Login from "./views/Login"
import Home from "./views/Home"
import Register from "./views/Register"
import ProtectedLayout from "./layout/ProtectedLayout"
import { SocketContext, socket } from "./context/socketContext"
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthProvider';
import LoggedInLayout from "./layout/LoggedInLayout"
import { SkeletonTheme } from "react-loading-skeleton"
import 'react-loading-skeleton/dist/skeleton.css'

function App() {

  return (
    <SkeletonTheme baseColor="#121212" highlightColor="#888" >
      <BrowserRouter>
        <AuthProvider>
          <SocketContext.Provider value={socket}>
            <Routes>

              <Route path="/" element={<LoggedInLayout/>}>
                <Route path="login" element={<Login/>} />
                <Route path="register" element={<Register/>} />
              </Route>

              <Route path="/home" element={<ProtectedLayout/>}>
                <Route index element={<Home/>} />
              </Route>
            
            </Routes>
          </SocketContext.Provider>
        </AuthProvider>
      </BrowserRouter>
    </SkeletonTheme>
  )
}

export default App
