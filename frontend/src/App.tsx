import './App.css';
import Home from "../src/pages/landing/Home"
import { Router,Route,Routes } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from "./context/AuthContext"
function App() {
 

  return (

   <>
   <Toaster position="top-right" reverseOrder={false} />
   <AuthProvider>  <AppRoutes/></AuthProvider>
  
  
   </>
   
  )
}

export default App
