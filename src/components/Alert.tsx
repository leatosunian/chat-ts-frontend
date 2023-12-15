import AlertInterface from '../interfaces/alert.interface';
import correct from '../assets/correct.png'
import remove from '../assets/remove.png'
import { useAnimate, usePresence } from 'framer-motion';
import { useEffect } from 'react';

type Props = AlertInterface

const Alert: React.FC<Props> = ({alertType, msg, error}) => {
  const [scope, animate] = useAnimate()
  const [isPresent, safeToRemove] = usePresence()

  /*useEffect(() => {
    console.log(error);
    
    animate(scope.current, {opacity: [0, 1, 1, 0] },  {duration: 7}) 
    
  }, [error])*/

  useEffect(() => {
    if (isPresent) {
      const enterAnimation = async () => {
        await animate(scope.current, { opacity: [0,1] }, {ease: 'easeInOut'})
      }
      enterAnimation()

    } else {
      const exitAnimation = async () => {
        await animate(scope.current, { opacity: 0 }, {ease: 'easeInOut'})
        safeToRemove()
      }
      
      exitAnimation()
    }
 }, [isPresent])
  


  return (
    <>
  
      <div ref={scope} className={`notificationContainer ${error ? "actived": ''}`} >
        <div style={{display:'flex', justifyContent:'center', height:'70%', alignItems:'center', gap:'20px'}}>
          {
            alertType === 'OK_ALERT' &&
            <img src={correct} alt="" style={{width: '45px', height: '45px'}}/>
          }
          
          {
            alertType === 'ERROR_ALERT' &&
            <img src={remove} alt="" style={{width: '45px', height: '45px'}}/>
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