import React, { useState } from 'react'
import { Provider, Subscribe, Container } from 'unstated'
import parseDuration from 'iso8601-duration'
import TimesheetsContainer from './TimesheetsContainer'
import humanizeDuration from 'humanize-duration'
import style from './Timesheets.module.css'
import dayStyle from './Day.module.css'
import dateFormat from 'dateformat'
import ms from 'ms'

function renderDate (date) {
  return dateFormat(date, 'ddd, d mmm')
}

const formatDuration = humanizeDuration.humanizer({
  language: 'shortEn',
  spacer: '',
  languages: {
    shortEn: {
      y: () => 'y',
      mo: () => 'mo',
      w: () => 'w',
      d: () => 'd',
      h: () => 'h',
      m: () => 'm',
      s: () => 's',
      ms: () => 'ms',
    }
  }
})

function renderDuration (duration) {
  if (duration) {
    return formatDuration(duration)
  } else {
    return ''
  }
}

function Timesheets () {
  const [fillDuration, setFillDuration] = useState('8h')

  return <>
    <h1>Timesheets</h1>
    <Subscribe to={[TimesheetsContainer]}>{
      timesheets => {
        const tasks = timesheets.tasks()

        return <>
          <div>
            <button onClick={() => timesheets.fillSelected(ms(fillDuration))}>fill selected</button>
            <input type="text" value={fillDuration} onChange={ev => setFillDuration(ev.target.value)} />
          </div>
          <table>
            <thead>
              <tr>
                <th>date</th>
                  {tasks.map(task => {
                    const selectDaysForTask = ev => {
                      timesheets.selectDaysForTask(task)
                      ev.stopPropagation()
                    }

                    return <th onClick={selectDaysForTask}>{task.name}</th>
                  })}
              </tr>
            </thead>
            <tbody>{
              timesheets.days().map(day => {
                const className = dayStyle[day.type]
                return <tr className={className}>
                  <td>{renderDate(day.date)}</td>
                  {
                    tasks.map(task => {
                      const dayTask = day.tasks[task.id]

                      const className = s => [dayTask && dayTask.selected ? style.selected : '', s].filter(Boolean).join(' ')

                      if (dayTask.duration) {
                        return <td onClick={() => timesheets.toggleSelection(dayTask)} className={className(style.duration)}>{renderDuration(dayTask.duration)}</td>
                      } else {
                        return <td onClick={() => timesheets.toggleSelection(dayTask)} className={className(style.noDuration)}></td>
                      }
                    })
                  }
                  <td>{day.comments.join()}</td>
                </tr>
              })
            }</tbody>
          </table>
        </>
      }
    }</Subscribe>
  </>
}

export default Timesheets
