import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from "react-router-dom";
import './index.css'; 
import SmoothScrollProvider from './components/SmoothScrollProvider' 
import ScrollToTop from './components/ScrollToTop'


const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(

    <BrowserRouter>  
    <ScrollToTop/>
     <SmoothScrollProvider>
  <App /> 
     </SmoothScrollProvider> 
  
    
    </BrowserRouter>
 
);
