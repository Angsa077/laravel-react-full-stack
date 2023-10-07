import { useRef, useState } from "react";
import { Link } from "react-router-dom"
import { useStateContext } from "../contexts/ContextProvider";
import axiosClient from "../axios-client";

const Login = () => {
    const emailRef = useRef();
    const passwordRef = useRef();
    const [errors, setErrors] = useState(null);
    const { setUser, setToken } = useStateContext();

    const onSubmit = (e) => {
        e.preventDefault()
        const payload = {
            email: emailRef.current.value,
            password: passwordRef.current.value,
        }
        setErrors(null)
        axiosClient.post('/api/login', payload)
            .then(({ data }) => {
                setUser(data.user)
                setToken(data.token)
            })
            .catch((err) => {
                const response = err.response;
                if (response && response.status === 422) {
                    if (response.data.errors) {
                        setErrors(response.data.errors)
                    } else {
                        setErrors({
                            email: [response.data.message]
                        })
                    }
                }
            })
    }
    return (
        <div className="flex min-h-screen items-center justify-center bg-blue-500">
            <div className="w-full p-16 bg-white max-w-sm rounded-lg shadow-md border-t-2">
                <h2 className="text-2xl text-center font-bold mb-2">Login</h2>
                {errors && (
                    <div>
                        {Object.keys(errors).map((key, index) => {
                            return <p key={index} className="text-red-500 text-sm text-center my-2">{errors[key][0]}</p>
                        })}
                    </div>
                )}
                <form className="space-y-4" onSubmit={onSubmit}>
                    <div className="">
                        <label htmlFor="email" className="block text-gray-700">Email</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="example@mail.com"
                            ref={emailRef}
                            className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-gray-700">Password</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="********"
                            ref={passwordRef}
                            className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <button className="bg-blue-500 text-white p-1 px-3 font-bold text-md rounded-md w-full">Login</button>
                    <div className='flex justify-start'>
                        <p className='text-xs mx-1'>Don't have an account?</p>
                        <Link to="/signup">
                            <p className='text-blue-500 text-xs'>Sign Up</p>
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login
