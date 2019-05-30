import { Container } from 'unstated'
import { groupBy, uniq, mapObject, flatten, sortBy } from 'lowscore'
import iso8601Duration from 'iso8601-duration'
import ms from 'ms'

const { toSeconds, parse } = iso8601Duration

function parseDuration (duration) {
  return toSeconds(parse(duration))
}

function normaliseState (state) {
  state.days.forEach(day => {
    Object.values(state.tasks).forEach(task => {
      day.tasks[task.id] = day.tasks[task.id] || {duration: 0}
    })
  })

  return state
}

export default class TimesheetsContainer extends Container {
  state = {
    days: [],
    tasks: [],
  }

  load () {
    this.setState(normaliseState({
      days: [
        {
          date: '2019-05-30',
          tasks: {
            holiday: {
              duration: ms('4h'),
            },
            ttc: {
              duration: ms('4h'),
            }
          },
          type: 'publicholiday',
          comments: ['Assmption (France)'],
        },
        {
          date: '2019-05-29',
          tasks: {
            ttc: {
              duration: ms('8h'),
            }
          },
          type: 'weekday',
          comments: [],
        },
        {
          date: '2019-05-28',
          tasks: {
            ttc: {
              duration: ms('8h'),
            }
          },
          type: 'weekday',
          comments: [],
        },
        {
          date: '2019-05-27',
          tasks: {
            ttc: {
              duration: ms('8h'),
            }
          },
          type: 'publicholiday',
          comments: ['Spring Bank Holiday (UK)'],
        },
        {
          date: '2019-05-26',
          tasks: {
          },
          type: 'weekend',
          comments: [],
        },
        {
          date: '2019-05-25',
          tasks: {
          },
          type: 'weekend',
          comments: [],
        },
      ],
      tasks: {
        ttc: {
          id: 'ttc',
          name: 'TTC',
        },
        holiday: {
          id: 'holiday',
          name: 'Holiday',
        },
      },
    }))
  }

  selectDaysForTask(task) {
    this.clearSelection()

    this.state.days.filter(day => day.type === 'weekday').forEach(day => {
      const dayTask = day.tasks[task.id] = day.tasks[task.id] || {}
      dayTask.selected = true
    })

    console.log('this.state.days', this.state.days)

    this.setState({days: this.state.days})
  }

  fillSelected (duration) {
    this.selectedDayTasks().forEach(dayTask => {
      dayTask.duration = duration
    })

    this.setState({days: this.state.days})
  }

  toggleSelection (dayTask) {
    dayTask.selected = !dayTask.selected

    this.setState({days: this.state.days})
  }

  selectedDayTasks () {
    return flatten(this.state.days.map(day => {
      return Object.values(day.tasks).filter(dayTask => dayTask.selected)
    }))
  }

  clearSelection () {
    this.state.days.forEach(day => {
      Object.values(day.tasks).forEach(dayTask => {
        dayTask.selected = false
      })
    })

    console.log('clear selection')
    this.setState({days: this.state.days})
  }

  days () {
    return sortBy(this.state.days, d => -d.date)
  }

  tasks () {
    const uniqueTaskIds = uniq(flatten(this.state.days.map(t => Object.keys(t.tasks))))

    return uniqueTaskIds.map(taskId => {
      const task = this.state.tasks[taskId]
      if (!task) {
        throw new Error('no such task ' + JSON.stringify(taskId))
      }
      return task
    })
  }
}

