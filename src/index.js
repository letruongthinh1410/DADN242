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
import Parameter from './pages/Main/Parameter/Parameter.jsx';
import TChu from './pages/Main/HomePage/HomePage.js'
import ReminderSchedule from './pages/Main/RemindPage/RPage.jsx'
import ReminderForm from './pages/Main/AddRm/AddRm.jsx'
import UserProfile from './pages/Main/InfoUser/InfoUser.jsx' 
import EditProfile from './pages/Main/editProfile/editProfile.jsx' 

const App = () => {
    const router = createBrowserRouter([
        {
            path: '/',
            element: <TChu/>,
            errorElement: <Error />,
        },
        {
            path: 'base',
            element: <Blank/>,
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
                        {
                            path: 'schedule',
                            element: <ReminderSchedule />,
                            handle: { title: "Lên lịch cây trồng" },
                        },
                        {  path: 'schedule/AddRm',
                            element: <ReminderForm />,
                            handle: { title: "Thêm lịch nhắc nhở" },
                        },
                        {
                            path: 'infor-account',
                            element: <UserProfile />,
                            handle: { title: "Thông tin tài khoản" },
                        },
                        {
                            path: 'infor-account/edit-profile',
                            element: <EditProfile />,
                            handle: { title: "Sửa thông tin tài khoản" },
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