//@flow
import curry from 'lodash.curry'
import get from './get'
import fromTime from './fromTime'

const setters = {
  'milliseconds': (value, date) => date.setUTCMilliseconds(value),
  'seconds': (value, date) => date.setUTCSeconds(value),
  'minutes': (value, date) => date.setUTCMinutes(value),
  'hours': (value, date) => date.setUTCHours(value),
  'date': (value, date) => date.setUTCDate(value),
  'month': (value, date) => date.setUTCMonth(value - 1),
  'year': (value, date) => date.setUTCFullYear(value)
}

export default curry((step, value, date) => {
  if (!setters.hasOwnProperty(step)) return new Date('invalid')

  const clone = fromTime(date.getTime())

  setters[step](value, clone)

  return (get(step, clone) === value) ? clone : new Date('invalid')
})
