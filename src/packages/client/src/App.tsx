import React from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import AdminIndex from './features/admin/components';
import ScreenRoute from './features/screen/components/ScreenRoute';
import './index.css';

function App() {
   return (
      <Router>
         <Routes>
            <Route path="/admin" element={<AdminIndex />} />
            <Route path="/screens/:screenId" element={<ScreenRoute />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
         </Routes>
      </Router>
   );
}

export default App;
