import React from 'react'



const Main = () =>{
    const handleLogout = () =>{
        localStorage.removeItem("token");
        window.location.reload();
    }
  return (
    <div>
        <nav>
            <h1>login</h1>
            <button onClick={handleLogout}>
                logout
            </button>
        </nav>
    </div>
  )
}

export default Main;