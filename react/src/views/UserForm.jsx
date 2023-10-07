import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

// icons
import { TbSquareRoundedArrowLeft } from 'react-icons/tb'
import axiosClient from '../axios-client';
import { useStateContext } from '../contexts/ContextProvider';

const UserForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState(null);
    const {setNotification} = useStateContext();
    const [user, setUser] = useState({
        id: null,
        name: '',
        email: '',
        password: '',
        password_confirmation: ''
    })

    if (id) {
        useEffect(() => {
            setLoading(true)
            axiosClient.get(`/api/users/${id}`)
                .then(({ data }) => {
                    setLoading(false)
                    setUser(data)
                })
                .catch(() => {
                    setLoading(false)
                })
        }, [])
    }

    const onSubmit = (e) => {
        e.preventDefault()
        if (user.id) {
            axiosClient.put(`/api/users/${user.id}`, user)
                .then(() => {
                    setNotification('User updated successfully')
                    navigate('/users')
                })
                .catch(() => {
                    const response = err.response;
                    if (response && response.status === 422) {
                        setErrors(response.data.errors)
                    }
                })
        } else {
            axiosClient.post(`/api/users`, user)
            .then(() => {
                setNotification('User created successfully')
                navigate('/users')
            })
            .catch((err) => {
                const response = err.response;
                if (response && response.status === 422) {
                    setErrors(response.data.errors)
                }
            })
        }
    }

    return (
        <div className="bg-white rounded-lg p-6 shadow-lg border-t-2 border border-gray-50">
            <div className='flex justify-between items-center'>
                {user.id && (<h2 className="text-xl font-bold mb-4 text-blue-500">{user.name}</h2>)}
                {!user.id && (<h2 className="text-xl font-bold mb-4 text-blue-500">Add New Users</h2>)}

                <Link to='/users'>
                    <TbSquareRoundedArrowLeft className='w-6 h-6 mb-3 text-blue-500 hover:scale-105' />
                </Link>
            </div>
            {loading && (<div colSpan="5" className="text-center">Loading . . .</div>)}
            {errors && (
                <div>
                    {Object.keys(errors).map((key, index) => {
                        return <p key={index} className="text-red-500 text-sm text-center my-2">{errors[key][0]}</p>
                    })}
                </div>
            )}
            {!loading && (
                <form onSubmit={onSubmit}>
                    <div className="mb-4">
                        <label htmlFor='name' className="block text-gray-600 text-sm font-semibold mb-2">Name:</label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            className="border rounded-md px-3 py-2 w-full focus:outline-none focus:border-blue-500"
                            placeholder='Enter your name'
                            value={user.name}
                            onChange={e => setUser({ ...user, name: e.target.value })}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor='email' className="block text-gray-600 text-sm font-semibold mb-2">Email:</label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            className="border rounded-md px-3 py-2 w-full focus:outline-none focus:border-blue-500"
                            placeholder='example@mail.com'
                            value={user.email}
                            onChange={e => setUser({ ...user, email: e.target.value })}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor='password' className="block text-gray-600 text-sm font-semibold mb-2">Password:</label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            className="border rounded-md px-3 py-2 w-full focus:outline-none focus:border-blue-500"
                            placeholder='******'
                            onChange={e => setUser({ ...user, password: e.target.value })}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor='confirmPassword' className="block text-gray-600 text-sm font-semibold mb-2">Confirm Password:</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            id="confirmPassword"
                            className="border rounded-md px-3 py-2 w-full focus:outline-none focus:border-blue-500"
                            placeholder='******'
                            onChange={e => setUser({ ...user, password_confirmation: e.target.value })}
                        />
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="px-4 py-1 bg-blue-500 text-white rounded-xl font-semibold hover:scale-105 shadow-md"
                        >
                            Save
                        </button>
                    </div>
                </form>
            )}
        </div>
    )
}

export default UserForm
