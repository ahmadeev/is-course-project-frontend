import './App.css'

import {HashRouter, Route, Routes} from "react-router-dom";

import Home from "./pages/_DBD/Home/Home.jsx";
import ProtectedRoute from "./components/_DBD/utils/ProtectedRoute.jsx";
import Auth from "./pages/_Common/Auth/Auth.jsx";
import {AuthProvider, useAuth} from "./components/_DBD/utils/AuthProvider.jsx";
import Admin from "./pages/_DBD/Admin/Admin.jsx";
import Forbidden from "./pages/_Common/Forbidden/Forbidden.jsx";

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
                  </Routes>
              </HashRouter>
          </AuthProvider>
      </>
  )
}

export default App
