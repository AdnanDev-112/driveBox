const UserNavbar = ({ userAddress }) => {
    const handleLogout = () => {
        window.localStorage.clear();
        window.location.href = '/account/login';
    }
    return (
        <>
            <div className="absolute mt-2 right-0 bg-white shadow-lg rounded-lg min-w-48 py-2 flex flex-col items-center">
                <p href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Address : {userAddress}</p>
                <button onClick={() => handleLogout()} className="bg-red-500 text-white px-4 py-2 rounded-lg h-full w-20 justify-center hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-green-700">
                    Logout
                </button>
            </div>
        </>
    )
}

export default UserNavbar;