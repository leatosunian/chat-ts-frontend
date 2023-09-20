import AlertInterface from '../interfaces/alert.interface';
type Props = AlertInterface

const Alert: React.FC<Props> = ({error, msg}) => {
  return (
    <div className= {`${error ? 'from-red-500 to-red-600' : 'from-indigo-500 to-indigo-700'} mt-5 bg-gradient-to-r text-center p-2 w-fit text-xs rounded-xl px-4 text-gray-300`} >
        {msg}
    </div>
  )
}

export default Alert