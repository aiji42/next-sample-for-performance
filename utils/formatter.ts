const _timeFormat = (inSec: number): [string, string] => {
  const sec = ('0' + Math.ceil(inSec % 60)).slice(-2)
  const min = ('0' + Math.ceil(inSec / 60)).slice(-2)
  return [min, sec]
}

export const timeFormattedString = (inSec: number) => {
  const [min, sec] = _timeFormat(inSec)
  return `${min} min ${sec} sec`
}

export const timeFormattedStringShort = (inSec: number) => {
  const [min, sec] = _timeFormat(inSec)
  return `${min}:${sec}`
}
