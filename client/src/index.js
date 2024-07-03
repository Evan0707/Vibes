import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {createBrowserRouter,RouterProvider} from 'react-router-dom'
import Layout from './components/Layout'
import ErrorPage from './pages/ErrorPage'
import Home from './pages/Home'
import ViewPosts from './pages/ViewPosts'
import CreatePosts from './pages/CreatePosts'
import SignIn from './pages/SignIn';
import Login from './pages/login';
import Accounts from './pages/Accounts';
import Results from './pages/Results';
import Preferences from './pages/Preferences';

const router = createBrowserRouter([
  {
    path:'/',
    element:<Layout/>,
    errorElement:<ErrorPage/>,
    children:[
      {index:true, element:<Home/>},
      {path:"post/create",element:<CreatePosts/>},
      {path:"post/:id",element:<ViewPosts/>},
      {path:"register",element:<SignIn/>},
      {path:"login",element:<Login/>},
      {path:"account/:pseudo",element:<Accounts/>},
      {path:"account/:pseudo/preferences",element:<Preferences/>},
      {path:"results/:query",element:<Results/>}
    ]
  }
])


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>
);
