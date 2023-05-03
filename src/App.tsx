import React from 'react'
import './App.css'
import Companies from './components/Companies/Companies'
import Workers from './components/WorkersList/Workers'

function App() {
  return (
    <div className="App">
      <Companies />

      <Workers />
    </div>
  );
}

export default App;
