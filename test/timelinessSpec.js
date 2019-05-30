import mountReactApp from './mountReactApp'
import App from '../src/App'
import TimesheetsContainer from '../src/TimesheetsContainer'

it('can do stuff', () => {
  const div = mountReactApp(App, {timesheets: new TimesheetsContainer()})
})
