import React from 'react';
import { Route, Routes } from 'react-router-dom';
import RepositoryList from './repository-list/repository-list';
import RepositoryDetails from './repository-details/repository-details';

function App() {
  return (
    <Routes>
      <Route exact path="/" element={<RepositoryList />} />
      <Route path="/repositories/:owner/:repo" element={<RepositoryDetails />} />
    </Routes>
  );
}

export default App;
