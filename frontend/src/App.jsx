import { useRecoilValue } from "recoil";
import { Navigate, Route, Routes } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Update from "./pages/Update";
import User from "./pages/User";
import Questions from "./pages/Questions";
import userAtom from "./atoms/userAtom";
import Error_404 from "./pages/Error_404";
import Dashboard from "./pages/Dashboard";

function App() {
  const user = useRecoilValue(userAtom);
  console.log("User: ", user);

  return (
    <Routes>
      <Route path='/' element={!user ? <Landing /> : <Navigate to={`/${user.username}/questions`}/>} />
      <Route path='/login' element={!user ? <Login /> : <Navigate to={`/${user.username}/questions`}/>} />
      <Route path='/signup' element={!user ? <Signup /> : <Navigate to={`/${user.username}/questions`}/>} />
      <Route path='/:username/update' element={user ? <Update /> : <Navigate to='/' />} />
      <Route path='/:username' element={user ? <User /> : <Navigate to='/' />} />
      <Route path='/:username/questions' element={<Questions />} />
      <Route path='/:username/dashboard' element={user ? <Dashboard /> : <Navigate to='/' />} />
      <Route path='/error' element={<Error_404 />} />
    </Routes>
  );
}

export default App;
