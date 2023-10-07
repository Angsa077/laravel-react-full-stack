import { useEffect, useState } from "react";
import axiosClient from "../axios-client.js";
import { Link } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider.jsx";

const Users = () => {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(false)
    const { setNotification } = useStateContext();

    useEffect(() => {
        getUsers();
    }, [])

    const deleteUser = (item) => {
        if (window.confirm('Are you sure wanna delete this?')) {
            setLoading(true)
            axiosClient.delete(`/api/users/${item.id}`)
                .then(() => {
                    setLoading(false)
                    setNotification('User deleted successfully')
                    getUsers()
                })
        }
    }

    const getUsers = () => {
        setLoading(true)
        axiosClient.get('/api/users')
            .then(({ data }) => {
                setLoading(false)
                console.log(data)
                setUsers(data.data)
            })
            .catch(() => {
                setLoading(false)
            })
    }

    return (
        <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
            <div className='flex justify-between'>

                <h1 className="text-2xl font-bold mb-5 text-blue-500">Table User</h1>
                <input
                    type="text"
                    className="rounded-xl m-3 border border-blue-500 shadow-md focus:ring-1 focus:ring-blue-500 focus:outline-none placeholder:text-blue-500 placeholder:text-center"
                    placeholder="Search by name"
                />
            </div>
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className='table-auto w-full text-sm border rounded-xl shadow-md hover:shadow-lg text-center text-black'>
                    <thead className='text-xs uppercase bg-blue-500 text-white'>
                        <tr>
                            <th scope="col" className="px-6 py-3">Id</th>
                            <th scope="col" className="px-6 py-3">Name</th>
                            <th scope="col" className="px-6 py-3">Email</th>
                            <th scope="col" className="px-6 py-3">Created Date</th>
                            <th scope="col" className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    {loading && (
                        <tbody>
                            <tr>
                                <td colSpan="5" className="text-center">Loading . . .</td>
                            </tr>
                        </tbody>
                    )}
                    {!loading && (
                        <tbody>
                            {users.map((item) => (
                                <tr key={item.id} className='bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'>
                                    <td scope="col" className="px-6 py-3">{item.id}</td>
                                    <td scope="col" className="px-6 py-3">{item.name}</td>
                                    <td scope="col" className="px-6 py-3">{item.email}</td>
                                    <td scope="col" className="px-6 py-3">{item.created_at}</td>
                                    <td scope="col" className="px-6 py-3">
                                        <Link to={`/users/${item.id}`} >
                                            <button className='mt-5 p-1 px-2 rounded-xl text-sm bg-yellow-300 text-white hover:scale-105 mr-2'>Edit</button>
                                        </Link>
                                        <button
                                            onClick={e => deleteUser(item)}
                                            className='mt-5 p-1 px-2 rounded-xl text-sm bg-red-500 text-white hover:scale-105'
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    )}
                </table>
            </div>

            <div className='flex justify-between'>
                <div className='flex justify-start'>
                    <Link
                        to='/users/new'
                        className='mt-5 p-2 rounded-xl text-sm font-bold border shadow-md hover:scale-105 bg-blue-500 text-white'
                    >
                        Add New
                    </Link>
                </div>

                <div className='flex justify-end'>
                    {/* Previous Page Button */}
                    <button
                        className='mt-5 p-2 rounded-xl text-sm font-bold border shadow-md hover:scale-105 border-blue-500 text-blue-500'
                    >
                        Previous
                    </button>

                    {/* Next Page Button */}
                    <button
                        className='mt-5 ml-2 p-2 rounded-xl text-sm font-bold border shadow-md hover:scale-105 border-blue-500 text-blue-500'
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Users
