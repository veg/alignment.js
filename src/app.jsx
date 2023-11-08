import React, { Component } from 'react';
import { createRoot } from 'react-dom/client';

import './styles.scss';

function NavBar(props) {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">Alignment UI</a>
      </div>
    </nav>
  );
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null
    };
  }
  render() {
    return (
      <div>
        <NavBar />
        <div style={{ maxWidth: 1140 }} className="container-fluid">
          <button>a button</button>
        </div>
      </div>
    );
  }
}

function Main(props) {
  return (
    <App />
  );
}

//PreventDefaultPatch(document);
const root_div = document.body.appendChild(document.createElement("div")),
  root = createRoot(root_div);
root.render(<Main />);

