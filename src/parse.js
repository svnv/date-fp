//@flow weak
import curry from 'lodash.curry'
import {DATE_TOKENS, MONTHS} from './helpers/constants'
import {fromPairs} from './helpers/util'

const _getMonthIndex = curry((list, key) => {
  const _key = key.slice(0, 3).toLowerCase()

  return list.findIndex(m => m.toLowerCase().slice(0, 3) === _key) + 1
})

const getMonthIndex = _getMonthIndex(MONTHS)
const century = () =>
  Math.floor(new Date().getFullYear() / 100) * 100

// define a parser for each supported date token
const TOKEN_PARSERS = {
  'YYYY': ['year', /\d{4}/, Number],
  'YY': ['year', /\d{2}/, n => Number(n) + century()],
  'Y': ['year', /\d{1,2}/, n => Number(n) + century()],
  'MMMM': ['month', /[a-zA-Z]{3,9}/, getMonthIndex],
  'MMM': ['month', /[a-zA-Z]{3}/, getMonthIndex],
  'MM': ['month', /\d{2}/, Number],
  'M': ['month', /\d{1,2}/, Number],
  'DD': ['day', /\d{2}/, Number],
  'D': ['day', /\d{1,2}/, Number],
  'Do': ['day', /\d{1,2}[a-zA-Z]{2}/, n => Number(n.slice(0, n.length - 2))],
  'HH': ['hour', /\d{2}/, Number],
  'H': ['hour', /\d{1,2}/, Number],
  'mm': ['minute', /\d{2}/, Number],
  'm': ['minute', /\d{1,2}/, Number],
  'ss': ['second', /\d{2}/, Number],
  's': ['second', /\d{1,2}/, Number],
  'SSS': ['millisecond', /\d{3}/, Number],
  'SS': ['millisecond', /\d{2,3}/, Number],
  'S': ['millisecond', /\d{1,3}/, Number],
}
const parseFormatString = format => format.match(DATE_TOKENS)

// recursively chop off parts of the datestring and parse them based on the syntax object
const parseDate = (result, datestring, syntax) => {
  const touple = syntax[0]
  let newstring = datestring

  if (syntax.length === 0) return result

  if (Array.isArray(touple)) {
    result.push([touple[0], datestring.match(touple[1])[0], touple[2]])
    newstring = datestring.replace(touple[1], '')
  }
  return parseDate(result, newstring, syntax.slice(1))
}
// coinstucts a map (eg. {year: 2014, month: 1, ...}) from the given dateparts
const constuctDateMap = dateparts =>
  fromPairs(dateparts
    .map(touple => [touple[0], touple[2](touple[1])]))

const validateDate = (date, parts) => {

  if (
   (date.getFullYear() !== parts[0]) ||
   (date.getMonth() !== parts[1]) ||
   (date.getDate() !== parts[2]) ||
   (date.getHours() !== parts[3]) ||
   (date.getMinutes() !== parts[4]) ||
   (date.getSeconds() !== parts[5]) ||
   (date.getMilliseconds() !== parts[6])
 ) return new Date(undefined)
  return date
}

// returns a Date from a dateMap
const constructDate = d => {
  const now = new Date()
  const dateParts = [
    d.year || now.getFullYear(),
    d.month ? d.month - 1 : now.getMonth(),
    d.day || now.getDate(),
    d.hour || 0,
    d.minute || 0,
    d.second || 0,
    d.millisecond || 0,
  ]

  return validateDate(new Date(...dateParts), dateParts)
}

export default curry((format, datestring) => {
  // The syntax object conatains a list strings and token parsers
  const syntax = parseFormatString(format)
    .map(token => TOKEN_PARSERS[token] || token)

  const tokenMap = constuctDateMap(parseDate([], datestring, syntax))

  return constructDate(tokenMap)
})
