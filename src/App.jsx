import './App.css'

import {HashRouter, Route, Routes} from "react-router-dom";

import Home from "./pages/_DBD/Home/Home.jsx";
import ProtectedRoute from "./components/_DBD/utils/ProtectedRoute.jsx";
import Auth from "./pages/_Common/Auth/Auth.jsx";
import {AuthProvider, useAuth} from "./components/_DBD/utils/AuthProvider.jsx";
import Admin from "./pages/_DBD/Admin/Admin.jsx";
import Forbidden from "./pages/_Common/Forbidden/Forbidden.jsx";
import Main from "./pages/_DBD/Main/Main.jsx";
import CharacterPage from "./pages/_DBD/CharacterPage/CharacterPage.jsx";
import BuildCreator from "./pages/_DBD/BuildCreator/BuildCreator.jsx";
import BuildGenerator from "./pages/_DBD/BuildGenerator/BuildGenerator.jsx";
import Id from "./pages/_DBD/Id/Id.jsx";

function App() {
  const { isAuthenticated } = useAuth();

  // зачем повторно обернул непонятно. уже не помню
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
                      <Route path="/main" element={<Main pageTitle="Главная" />} />
                      <Route path="/character/:text" element={<CharacterPage pageTitle="Персонаж" />} />
                      <Route path="/add-match" element={<BuildCreator />} />
                      <Route path="/generate-build" element={<BuildGenerator />} />
                      <Route path="/id" element={<Id />} />
                  </Routes>
              </HashRouter>
          </AuthProvider>
      </>
  )
}

export default App
