import { Navigate } from "react-router-dom"

const Redirect = () => {

  return (
    <div className="redirect">
        <Navigate to='/login' />
    </div>
  )
}

export default Redirect