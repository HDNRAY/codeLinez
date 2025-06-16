import { Provider } from 'react-redux'
import './App.css'
import Game from './features/game/Game'
import { store } from './redux/store'

const App = () => {
    return (
        <div className="App">
            <Provider store={store}>
                <Game />
            </Provider>
        </div>
    )
}

export default App
