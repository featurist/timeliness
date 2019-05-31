import React, { useState } from 'react'
import styled from "styled-components"
import PageContainer from "@material-ui/core/Container"
import { Paper, TextField, Checkbox, Button, Toolbar, FormGroup, Typography, TableBody } from "@material-ui/core"
import { Table, TableRow, TableCell, TableHead } from "@material-ui/core"
import { Provider, Subscribe, Container } from 'unstated'
import parseDuration from 'iso8601-duration'
import NavBar from "./components/NavBar"
import TimesheetsContainer from './TimesheetsContainer'
import humanizeDuration from 'humanize-duration'
import style from './Timesheets.module.css'
import dayStyle from './Day.module.css'
import dateFormat from 'dateformat'
import ms from 'ms'

// TODO: use theming provided by material instead of styled components"
const Submit = styled(Button)`
  & {
    margin-top: 8px !important;
    margin-bottom: 4px !important;
  }
`

const TextFieldWrapper = styled(TextField)`
  margin-right: 20px !important;
`

const ActionsBar = styled(Toolbar)`
  margin-top: 30px !important;
  margin-bottom: 30px !important;
  padding-top: 10px !important;
`

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
    <NavBar elevation={3} />
    <Subscribe to={[TimesheetsContainer]}>{
      timesheets => {
        const tasks = timesheets.tasks()

        return <>
          <PageContainer maxWidth="xl">
            <Paper>
              <ActionsBar elevation={0}>
                <FormGroup row>
                <TextFieldWrapper
                  label="Duration"
                  type="text"
                  name="duration"
                  margin="dense"
                  variant="outlined"
                  value={fillDuration} onChange={ev => setFillDuration(ev.target.value)}
                />
                <Submit variant="contained" color="secondary" size="medium" onClick={() => timesheets.fillSelected(ms(fillDuration))}>Fill Selected</Submit>
                </FormGroup>
              </ActionsBar>

              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox />
                    </TableCell>
                    <TableCell>
                      Date
                    </TableCell>
                    {tasks.map(task => {
                      const selectDaysForTask = ev => {
                        timesheets.selectDaysForTask(task)
                        ev.stopPropagation()
                      }

                      return <TableCell onClick={selectDaysForTask}>{task.name}</TableCell>
                    })}
                    <TableCell>
                      Comments
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {
                    timesheets.days().map(day => {
                      const className = dayStyle[day.type]
                      return <TableRow className={className}>
                        <TableCell padding="checkbox">
                          <Checkbox />
                        </TableCell>
                        <TableCell>{renderDate(day.date)}</TableCell>
                        {
                          tasks.map(task => {
                            const dayTask = day.tasks[task.id]

                            const className = s => [dayTask && dayTask.selected ? style.selected : '', s].filter(Boolean).join(' ')

                            if (dayTask.duration) {
                              return <TableCell onClick={() => timesheets.toggleSelection(dayTask)} className={className(style.duration)}>{renderDuration(dayTask.duration)}</TableCell>
                            } else {
                              return <TableCell onClick={() => timesheets.toggleSelection(dayTask)} className={className(style.noDuration)}></TableCell>
                            }
                          })
                        }
                        <TableCell>{day.comments.join()}</TableCell>
                      </TableRow>
                    })
                  }
                </TableBody>
              </Table>
            </Paper>
          </PageContainer>  
        </>
      }
    }</Subscribe>
  </>
}

export default Timesheets
