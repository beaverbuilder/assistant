import { useAppContext } from './context'
import Content from './content'

// Root component for an app
const App = {}

App.use = useAppContext
App.Content = Content

export default App
