import React, {useEffect} from 'react';
import './App.css';
import { Provider } from 'unstated'
import Timesheets from './Timesheets'

function App({timesheets}) {
  useEffect(() => {
    timesheets.load()
  })

  return (
    <div>
      <Provider inject={[timesheets]}>
        <Timesheets/>
      </Provider>
    </div>
  );
}

export default App;
