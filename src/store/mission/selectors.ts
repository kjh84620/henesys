import createCachedSelector from 're-reselect'
import { today } from 'src/utils'
import {
  AppState,
  getSelectedCharacterName,
} from '../selectors'

type Record = { [key: string]: boolean }

export type MissionState = {
  todos: {
    [key: string]: string[];
  };
  records: {
    [key: string]: {
      [key: string]: Record;
    };
  };
  date: string;
}

const initialState: MissionState = {
  todos: {},
  records: {},
  date: today(),
}

export default initialState

export const getCurrentDate = (state: AppState) => state.mission.date

export const getTodos = (state: AppState) => state.mission.todos[getSelectedCharacterName(state)]

export const getFirstDate = (state: AppState) => {
  return Object.keys(state.mission.records[getSelectedCharacterName(state)])[0]
}

export const getRecordOfDate = (
  state: AppState,
  day: string,
) => state.mission.records[getSelectedCharacterName(state)][day] || {}

export const getRecordsOfMonth = (
  state: AppState,
  month: string,
) => {
  const records = state.mission.records[getSelectedCharacterName(state)]
  return Object.keys(records).filter(key => key.startsWith(month)).map(key => records[key])
}

export const getRecordsOfPeriod = (
  state: AppState,
  period: number,
) => Object.values(state.mission.records[getSelectedCharacterName(state)]).slice(-period) || []

export const getCompletes = (record: Record) => Object.values(record).filter(v => v).length

export const getProgress = (record: Record) => {
  const source = Object.values(record)
  return source.filter(v => v).length / (source.length || 1)
}

export const getMissionStatus = createCachedSelector(
  [getRecordOfDate, (_: AppState, __: string, name: string) => name],
  (missions, name) => missions[name],
)((_: AppState, day: string, name: string) => `${day}-${name}`)

export const getDailyCompletes = createCachedSelector(getRecordOfDate, getCompletes)((_, day) => day)

export const getDailyProgress = createCachedSelector(getRecordOfDate, getProgress)((_, day) => day)

export const getMonthlyCompletes = createCachedSelector(
  getRecordsOfMonth,
  records => records.reduce((completes, record) => completes + getCompletes(record), 0),
)((_, period) => period)

export const getMonthlyProgress = createCachedSelector(
  getRecordsOfMonth,
  records => records.reduce((progresses, record) => progresses + getProgress(record), 0) / (records.length || 1),
)((_, period) => period)

export const getPeriodCompletes = createCachedSelector(
  getRecordsOfPeriod,
  records => records.reduce((completes, record) => completes + getCompletes(record), 0),
)((_, period) => period)

export const getPeriodProgress = createCachedSelector(
  getRecordsOfPeriod,
  records => records.reduce((progresses, record) => progresses + getProgress(record), 0) / (records.length || 1),
)((_, period) => period)

const accumulator = (percent: number) => (
  days: number,
  record: Record,
) => days + (getProgress(record) >= percent ? 1 : 0)

export const getCompleteDays = createCachedSelector(
  getRecordsOfPeriod,
  records => records.reduce(accumulator(1), 0),
)((_, period) => period)

export const getAlmostCompleteDays = createCachedSelector(
  [getRecordsOfPeriod, getCompleteDays],
  (records, completes) => records.reduce(accumulator(0.7), 0) - completes,
)((_, period) => period)

export const getIncompleteDays = createCachedSelector(
  [getRecordsOfPeriod, getCompleteDays, getAlmostCompleteDays],
  (records, completes, almostCompletes) => records.length - (completes + almostCompletes),
)((_, period) => period)

export const getCurrentStreaks = createCachedSelector(
  getRecordsOfPeriod,
  (records) => {
    let streak = records.length - 1
    while (streak >= 0) {
      if (getProgress(records[streak]) === 1) {
        streak--
      } else {
        break
      }
    }
    return records.length - streak - 1
  },
)((_, period) => period)

export const getLongestStreaks = createCachedSelector(
  getRecordsOfPeriod,
  (records) => {
    const streaks = records.reduce((result, record) => getProgress(record) === 1 ? ({
      ...result,
      current: result.current + 1,
    }) : ({
      current: 0,
      max: Math.max(result.max, result.current),
    }), {
      current: 0,
      max: 0,
    })
    return Math.max(streaks.current, streaks.max)
  },
)((_, period) => period)
