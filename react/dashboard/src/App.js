import Sidebar from "./components/sidebar/Sidebar";
import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import UserList from "./pages/userList/UserList";

function App() {
  return (
    <Router>
      <div className="container">
        <Sidebar />
        <Switch>
          <Route exact path="/">
          <UserList />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
