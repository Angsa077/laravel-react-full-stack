import { Link, Navigate, Outlet, useLocation } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";
import { useEffect, useState } from "react";
import axiosClient from "../axios-client";

//icons
import { FiMenu } from 'react-icons/fi';

const DefaultLayout = () => {
    const { user, token, setUser, setToken, notification } = useStateContext();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const location = useLocation();

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const toggleProfile = () => {
        setIsProfileOpen(!isProfileOpen);
    };

    const onLogout = (e) => {
        e.preventDefault()

        axiosClient.post('/api/logout')
            .then(({ }) => {
                setUser({})
                setToken(null)
            })
    }

    useEffect(() => {
        axiosClient.get('/api/user')
            .then(({ data }) => {
                setUser(data)
            })
    }, [])

    if (!token) {
        return <Navigate to="/login" />
    }

    return (
        <>
            {/* Navbar */}
            <nav className="fixed top-0 z-50 w-full shadow-md bg-white">
                <div className="px-3 py-1 lg:px-5 lg:pl-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center justify-start">
                            <button
                                onClick={toggleMenu}
                                className="inline-flex items-center p-2 text-sm text-blue-500 rounded-lg sm:hidden focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {isMenuOpen ? (
                                    <span className="sr-only">Close sidebar</span>
                                ) : (
                                    <span className="sr-only">Open sidebar</span>
                                )}
                                <FiMenu className="w-6 h-6" />
                            </button>
                            <Link to={'/'} className="flex ml-2 md:mr-24">
                                <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap text-blue-500">
                                    Webapp
                                </span>
                            </Link>
                        </div>
                        <div>
                            <button
                                type="button"
                                onClick={toggleProfile}
                            >
                                <span className="sr-only">Open user menu</span>
                                <img
                                    className="w-10 h-10 rounded-full"
                                    src="https://res.cloudinary.com/dzm4joz1v/image/upload/v1695884510/assets/drchip/user-notfound_m1pjci.png"
                                    alt="user photo"
                                />
                            </button>

                            {/* User Dropdown Content */}
                            <div className={`z-50 ${isProfileOpen ? 'translate-x-0 mr-2' : 'translate-x-full'} my-4 bg-white rounded-md shadow-md border-t-2 absolute right-0 transition-transform`}>
                                <div className="px-4 text-right my-3">
                                    <p className="text-gray-800 font-semibold">
                                        {user.name}
                                    </p>
                                    <p className="text-gray-600">
                                        {user.email}
                                    </p>
                                    <button
                                        className='bg-blue-500 px-3 py-1 mt-3 rounded-lg text-white hover:scale-105 hover:font-bold'
                                        onClick={onLogout}
                                    >
                                        Logout
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Sidebar */}
            <aside
                className={`fixed top-10 left-0 z-40 w-64 h-screen pt-7 transition-transform ${isMenuOpen ? '-translate-x-0' : '-translate-x-full'} sm:translate-x-0 text-white shadow-md bg-blue-500`}
            >
                <div className="h-full px-3 pb-4 overflow-y-auto">
                    <ul className="space-y-2 font-medium">
                        {/* sidebar items */}
                        {[
                            { label: 'Dashboard', to: '/dashboard' },
                            { label: 'Users', to: '/users' },
                        ].map((item, index) => (
                            <li key={index} className={`transform transition-all hover:scale-105 hover:font-bold hover:bg-white hover:text-blue-500 hover:rounded-md ${location.pathname === item.to ? 'bg-white text-blue-500 rounded-md' : ''}`}>
                                <Link to={item.to} className="flex items-center ml-3 gap-3 py-2">
                                    <span>{item.label}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </aside>

            {/* Main */}
            <main className="p-4 sm:ml-64 mt-5">
                <div className="p-4">
                    <div className="grid grid-cols-1 gap-4 mb-4">
                        <div className="mx-10 py-10">
                            <Outlet />
                        </div>
                    </div>
                </div>
                {notification && (
                    <div className="fixed bottom-10 right-10 shadow-md bg-blue-500 rounded-lg p-6 text-white font-bold text-center border-t-2">{notification}</div>
                )}
            </main>
        </>
    )
}

export default DefaultLayout
