import React from 'react';
import { Outlet } from 'react-router-dom';

function Blank() {
    return (
        <div className="blank">
          <Outlet/>
        </div>
    );
}

export default Blank;