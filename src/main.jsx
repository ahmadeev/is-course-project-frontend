import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {AuthProvider} from "./components/_DBD/utils/AuthProvider.jsx";
import {DataProvider} from "./components/_DBD/utils/DataProvider.jsx";

createRoot(document.getElementById('root')).render(
    // вероятно, стрикт мод мешает вебсокетам (не было проверено)
/*  <StrictMode>
      <AuthProvider>
          <App />
      </AuthProvider>
  </StrictMode>,*/

    <DataProvider>
        <AuthProvider>
            <App />
        </AuthProvider>
    </DataProvider>
)
