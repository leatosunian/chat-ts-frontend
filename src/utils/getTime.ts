import moment from 'moment';
import 'moment/locale/es'

export const getActualTime = () => {
    moment.locale('es')
    const date = moment().format('LT')
    return date
}