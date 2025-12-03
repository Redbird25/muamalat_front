import './App.css';
import Routes from "./routes";
import 'react-toastify/dist/ReactToastify.min.css';
import {ToastContainer} from "react-toastify";
import {useEffect} from "react";
import {shallowEqual, useSelector} from "react-redux";

function App() {
  const {isAuthenticated, regions} = useSelector(state => ({
    isAuthenticated: state.auth?.isAuthenticated,
    regions: state.system?.regions || []
  }), shallowEqual);
  useEffect(() => {
    // Regions fetch disabled per request (backend 404). Enable when endpoint is available.
  }, [isAuthenticated, regions]);
  
  return (
    <div className={"main-body body-img position-relative"} id="main-body">
      <Routes/>
      <ToastContainer className={"z-index-infinite"} autoClose={3000}/>
    </div>
  );
}

export default App;
