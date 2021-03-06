import React from "react"
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'

const NavBar = () => {
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography component="h1" variant="h5" color="inherit">
            Timesheets
          </Typography>
        </Toolbar>
      </AppBar>
    </>
  )
}

export default NavBar
