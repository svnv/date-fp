const isNotNil = x => x !== undefined && x !== null
export default (dateParts) => {
  const [year, month, day, hour, minute, second, millies] = dateParts
  if (isNotNil(year) && year < 0) return new Date('invalid')
  if (isNotNil(month) && (month < 0 || month > 11)) return new Date('invalid')
  if (isNotNil(day) && (day < 0 || day > 31)) return new Date('invalid')
  if (isNotNil(hour) && (hour < 0 || hour > 23)) return new Date('invalid')
  if (isNotNil(minute) && (minute < 0 || minute > 59)) return new Date('invalid')
  if (isNotNil(second) && (second < 0 || second > 59)) return new Date('invalid')
  if (isNotNil(millies) && (millies < 0 || millies > 999)) return new Date('invalid')
  return new Date(Date.UTC(...dateParts))
}
