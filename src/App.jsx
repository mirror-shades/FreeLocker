import Webpage from "./Webpage";
import "./App.css";
import React from "react";
import ReactDOM from "react-dom";

class App extends React.Component {
  state = {
    loading: true,
  };

  componentDidMount() {
    // this simulates an async action, after which the component will render the content
    demoAsyncCall().then(() => this.setState({ loading: false }));
  }

  render() {
    const { loading } = this.state;

    if (loading) {
      // if your component doesn't have to wait for an async action, remove this block
      return <div />; // render null when app is not ready
    } else {
      return (
        <div>
          <Webpage />;
        </div>
      );
    }
  }
}

function demoAsyncCall() {
  return new Promise((resolve) => setTimeout(() => resolve(), 2500));
}

export default App;
