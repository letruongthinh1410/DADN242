import React from 'react';
import ReactDOM from 'react-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async'
import Blank from './pages/Blank.jsx'
import Error from './pages/Error.jsx'

import Base from './pages/Base.jsx';
import Home from './pages/Main/Home/Home.jsx';

import AddPlant from './pages/Main/AddPlant/AddPlant.jsx';

const App = () => {
    const router = createBrowserRouter([
        {
            path: '/',
            element: <Blank />,
            errorElement: <Error />,
            children: [
                {
                    path: '',
                    element: <Base/>,
                    children: [
                        {
                            path: 'plants',
                            element: <Home />,
                            handle: { title: "Danh sách cây trồng" },
                            children: [
                                {
                                    path: 'add',
                                    element: <AddPlant />,
                                    handle: { title: "Thêm cây trồng" },
                                }
                            ]
                        },
                    ],
                }
            ]
        }
    ])
    
    return (
        <HelmetProvider>
            <RouterProvider router={router} />
        </HelmetProvider>
    )
}
ReactDOM.createRoot(document.getElementById('root')).render(<App />);