import React from 'react';
import { RouterProvider } from 'react-router-dom';
import router from './router';

function App() {
  return (
    <div className="admin-app">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
