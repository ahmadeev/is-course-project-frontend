import './App.css'

import {HashRouter, Route, Routes} from "react-router-dom";

import Home from "./pages/Home/Home.jsx";
import ProtectedRoute from "./components/utils/ProtectedRoute.jsx";
import Auth from "./pages/Auth/Auth.jsx";
import {AuthProvider, useAuth} from "./components/utils/AuthProvider.jsx";
import Admin from "./pages/Admin/Admin.jsx";
import Forbidden from "./pages/Forbidden/Forbidden.jsx";
import ImportHistory from "./pages/ImportHistory/ImportHistory.jsx";
// import CountDownToNewYear from "./pages/_Example/CountDownToNewYear/CountDownToNewYear.jsx";
// import CountDownToVikasBirthday from "./pages/_Example/CountDownToVikasBirthday/CountDownToVikasBirthday.jsx";

function App() {
  const { isAuthenticated } = useAuth();

  return (
      <>
          <AuthProvider>
              <HashRouter>
                  <Routes>
                      <Route path="/" element={<Home pageTitle="Домашняя" />} />
                      <Route path="/forbidden" element={<Forbidden pageTitle="Доступ запрещен" />} />
                      <Route path="/auth" element={<Auth pageTitle="Войти" isSignedUp={true} />} />
                      <Route path="/admin" element={
                          <ProtectedRoute isAuthenticated={isAuthenticated} requiredRoles={["ADMIN"]}>
                              <Admin pageTitle="Панель управления" />
                          </ProtectedRoute>
                      } />
                      <Route path="/import/history" element={<ImportHistory pageTitle="История импортов" />} />
                      {/*<Route path="/ny" element={<CountDownToNewYear pageTitle="Счётчик дней до Нового года" />} />*/}
                      {/*<Route path="/vbd" element={*/}
                      {/*    <ProtectedRoute isAuthenticated={isAuthenticated} requiredRoles={["USER"]}>*/}
                      {/*        <CountDownToVikasBirthday pageTitle="Счётчик дней до дня рождения Вики" />*/}
                      {/*    </ProtectedRoute>*/}
                      {/*} />*/}
                  </Routes>
              </HashRouter>
          </AuthProvider>



      </>
  )
}

export default App
