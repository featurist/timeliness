import React, {useEffect} from 'react';
import logo from './logo.svg';
import './App.css';
import styles from './MyStyles.module.css'
import { Provider } from 'unstated'
import TimesheetsContainer from './TimesheetsContainer'
import Timesheets from './Timesheets'

const timesheetsContainer = new TimesheetsContainer()

function App() {
  useEffect(() => {
    timesheetsContainer.load()
  })

  return (
    <div>
      <Provider inject={[timesheetsContainer]}>
        <Timesheets/>
      </Provider>
    </div>
  );
}

export default App;
