import {Route,BrowserRouter,Routes,HashRouter} from 'react-router-dom';
import Homepage from './pages/Homepage';
import './App.css'

export default  function App(){

  return(
    <HashRouter>
      <Routes>
        <Route path='/' exact element={<Homepage/>}/>
      </Routes>
    </HashRouter>
  )
}
