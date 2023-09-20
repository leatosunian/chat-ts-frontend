import Login from "./views/Login"
import Home from "./views/Home"
import Register from "./views/Register"
import { SocketContext, socket } from "./context/socketContext"
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {

  return (
    <BrowserRouter>
      <SocketContext.Provider value={socket}>
        <Routes>

          <Route path="/">
            <Route path="/login" element={<Login/>} />
            <Route path="/register" element={<Register/>} />
          </Route>

          <Route path="/home">
            <Route index element={<Home/>} />
          </Route>
        
        </Routes>
      </SocketContext.Provider>
    </BrowserRouter>
  )
}

export default App
