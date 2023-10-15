import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Analysis from './pages/Analysis';
import Table from './pages/Table';

const App = () => {
  return (
    <Routes>
      <Route path='/' index element={<HomePage />}></Route>
      <Route path='/analysis' index element={<Analysis />}></Route>
      <Route path='/table' index element={<Table />}></Route>
    </Routes>
  );
};

export default App;
