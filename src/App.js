import './App.css';
import Routes from "./routes";
import 'react-toastify/dist/ReactToastify.min.css';
import {ToastContainer} from "react-toastify";
import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import Actions from "./redux/actions";

function App() {
  const dispatch = useDispatch();
  const {auth: {isAuthenticated}, system: {regions}} = useSelector(state => state);
  useEffect(() => {
    if (!regions.length) {
      dispatch(Actions.REGIONS.request());
    }
  }, [dispatch, regions, isAuthenticated]);
  
  return (
    <div className={"main-body body-img position-relative"} id="main-body">
      <Routes/>
      <ToastContainer className={"z-index-infinite"} autoClose={3000}/>
    </div>
  );
}

export default App;
