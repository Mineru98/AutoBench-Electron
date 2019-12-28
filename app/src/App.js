import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import Main from "./components/Main/Main"
import './App.css';

function App() {
  return (
		<BrowserRouter>
			<Switch id="main_page">
        <Route path="/" component={Main} />
			</Switch>
		</BrowserRouter>
  );
}

export default App;
