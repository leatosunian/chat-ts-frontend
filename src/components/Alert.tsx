import AlertInterface from '../interfaces/alert.interface';
type Props = AlertInterface

const Alert: React.FC<Props> = ({alertType, msg, error}) => {

  return (
    <>
  
      <div className={`notificationContainer ${error ? "actived": ''}`} >
        <div style={{display:'flex', justifyContent:'center', height:'70%', alignItems:'center', gap:'20px'}}>
          {
            alertType === 'OK_ALERT' &&
            <img src="../../public/assets/correct.png" alt="" style={{width: '45px', height: '45px'}}/>
          }
          
          {
            alertType === 'ERROR_ALERT' &&
            <img src="../../public/assets/remove.png" alt="" style={{width: '45px', height: '45px'}}/>
          }
          
          <span>{msg}</span>
        </div>
      </div>

      {/* <div className= {`${error ? 'from-red-500 to-red-600' : 'from-indigo-500 to-indigo-700'} mt-5 bg-gradient-to-r text-center p-2 w-fit text-xs rounded-xl px-4 text-gray-300`} >
          {msg}
      </div> */}
    </>
  )
}

export default Alert