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
import UpdatePlant from './pages/Main/UpdatePlan/UpdatePlant.jsx';
import Parameter
 from './pages/Main/Parameter/Parameter.jsx';
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
                        },
                        {
                            path: 'plants/add',
                            element: <AddPlant />,
                            handle: { title: "Thêm cây trồng" },
                        },
                        {
                            path: 'plants/update',
                            element: <UpdatePlant />,
                            handle: { title: "Cập nhật cây trồng" },
                        },
                        {
                            path: 'plants/parameter',
                            element: <Parameter />,
                            handle: { title: "Thông số cây trồng" },
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