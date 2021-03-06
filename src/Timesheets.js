import React, { useState } from 'react'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'
import PageContainer from "@material-ui/core/Container"
import { AppBar, Paper, TextField, Checkbox, Button, Toolbar, FormGroup, TableBody, Typography } from "@material-ui/core"
import { Table, TableRow, TableCell, TableHead } from "@material-ui/core"
import orange from '@material-ui/core/colors/orange'
import red from '@material-ui/core/colors/red'
import lime from '@material-ui/core/colors/lime'
import green from '@material-ui/core/colors/green'
import { Provider, Subscribe, Container } from 'unstated'
import parseDuration from 'iso8601-duration'
import NavBar from "./components/NavBar"
import TimesheetsContainer from './TimesheetsContainer'
import humanizeDuration from 'humanize-duration'
import dateFormat from 'dateformat'
import ms from 'ms'

const useStyles = makeStyles(theme => ({
  pageContainer: {
    marginBottom: theme.spacing(4),
    marginTop: theme.spacing(4)
  },
  actionBar: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1)
  },
  submit: {
    marginTop: 8,
    marginBottom: 4
  },
  textField: {
    marginRight: theme.spacing(2)
  },

  // row/cell styles
  noDuration: {
    backgroundColor: red[50],
    borderWidth: 2,
    borderColor: red['A100'],
    borderStyle: 'dashed'

  },
  duration: {
    backgroundColor: green[50],
    borderColor: "transparent",
  },
  selected: {
    backgroundColor: lime['A400'],
    borderWidth: 2,
    borderColor: lime['A700'],
    borderStyle: 'dashed'
  },
  weekend: {
    backgroundColor: theme.palette.grey[50] + '50', // + HEX opacity (00 to ff)
    opacity: 0.3
  },
  publicholiday: {
    backgroundColor: orange[50] + '70'
  }  
}));

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
  const classes = useStyles()

  return <>
    <NavBar elevation={3} />
    <Subscribe to={[TimesheetsContainer]}>{
      timesheets => {
        const tasks = timesheets.tasks()
        console.log(timesheets.selectedDayTasks())
        return <>
          <PageContainer maxWidth="xl" className={classes.pageContainer}>
            <Paper>
              <AppBar position="sticky" color="default" elevation={0}>
                <Toolbar className={classes.actionBar}>
                  {timesheets.selectedDayTasks().length > 0 ?
                    <FormGroup row>
                      <TextField
                        label="Duration"
                        type="text"
                        name="duration"
                        margin="dense"
                        variant="outlined"
                        value={fillDuration}
                        onChange={ev => setFillDuration(ev.target.value)}
                        className={classes.textField}
                      />
                      <Button className={classes.submit} variant="contained" color="secondary" size="medium" onClick={() => timesheets.fillSelected(ms(fillDuration))}>Fill Selected</Button>
                    </FormGroup>
                    :
                    <Typography variant="h6">Select one or more cells...</Typography>
                  }
                </Toolbar>
              </AppBar>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox disabled />
                    </TableCell>
                    <TableCell>
                      Date
                    </TableCell>
                    {tasks.map((task, index) => {
                      const selectDaysForTask = ev => {
                        timesheets.selectDaysForTask(task)
                        ev.stopPropagation()
                      }

                      return <TableCell
                        key={`tableCellTitle-${index}`}
                        onClick={selectDaysForTask}>
                          {task.name}
                      </TableCell>
                    })}
                    <TableCell>
                      Comments
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {
                    timesheets.days().map((day, index) => {
                      return <TableRow key={`tableRow-${index}`} className={classes[day.type]}>
                        <TableCell padding="checkbox">
                          <Checkbox disabled />
                        </TableCell>
                        <TableCell>{renderDate(day.date)}</TableCell>
                        {
                          tasks.map(task => {
                            const dayTask = day.tasks[task.id]

                            return <TableCell
                              key={task.id}
                              onClick={() => timesheets.toggleSelection(dayTask)}
                              className={clsx({
                                [classes.selected]: dayTask && dayTask.selected,
                                [classes.duration]: dayTask && dayTask.duration,
                                [classes.noDuration]: dayTask && !dayTask.duration && !["weekend", "publicholiday"].includes(day.type),
                              })}>
                                {dayTask && dayTask.duration ? renderDuration(dayTask.duration) : ''}
                            </TableCell>
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
