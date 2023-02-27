import { useDispatch } from 'react-redux';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import AdminIndex from './features/admin/components';
import ScreenControlRoute from './features/screen-control/components/ScreenControlRoute';
import ScreenRoute from './features/screen/components/ScreenRoute';
import { syncServerTime } from './features/sync-time/slice';
import './index.css';

function App() {
   const dispatch = useDispatch();
   dispatch(syncServerTime());

   return (
      <Router>
         <Routes>
            <Route path="/admin" element={<AdminIndex />} />
            <Route path="/screens/:screenId" element={<ScreenRoute />} />
            <Route path="/screens/:screenId/control" element={<ScreenControlRoute />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
         </Routes>
      </Router>
   );
}

export default App;
