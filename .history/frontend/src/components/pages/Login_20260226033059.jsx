import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Layout from '../common/Layout'
import { useForm } from 'react-hook-form';
import { apiUrl } from '../common/Config';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/Auth';

const Login = () => {

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const {
        handleSubmit,
        register,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {

        try {
            const response = await fetch(`${apiUrl}/login`, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (result.status === 200) {

                // ✅ Save full auth structure
                const authData = {
                    token: result.token,
                    user: result.user
                };

                login(authData); // this stores to localStorage (from Auth.jsx)

                toast.success("Login successful!");

                // ✅ Role-based redirect
                if (result.user.role === "student") {
                    navigate('/account/my-learning');
                }
                else if (result.user.role === "instructor") {
                    navigate('/account/my-courses');
                }
                else if (result.user.role === "admin") {
                    navigate('/account/dashboard');
                }

            } else {
                toast.error(result.message || "Login failed");
            }

        } catch (error) {
            toast.error("Server error. Please try again.");
        }
    };

    return (
        <Layout>
            <div className='container py-5 mt-5'>
                <div className='d-flex align-items-center justify-content-center'>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className='card border-0 shadow login'>
                            <div className='card-body p-4'>
                                <h3 className='border-bottom pb-3 mb-3'>Login</h3>

                                <div className='mb-3'>
                                    <label className='form-label'>Email</label>
                                    <input
                                        {...register('email', {
                                            required: "The email field is required.",
                                            pattern: {
                                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                message: "Invalid email address"
                                            }
                                        })}
                                        type="text"
                                        className={`form-control ${errors.email && 'is-invalid'}`}
                                        placeholder='Email'
                                    />
                                    {errors.email &&
                                        <p className='invalid-feedback'>{errors.email.message}</p>
                                    }
                                </div>

                                <div className='mb-3'>
                                    <label className='form-label'>Password</label>
                                    <input
                                        {...register('password', {
                                            required: "The password field is required."
                                        })}
                                        type="password"
                                        className={`form-control ${errors.password && 'is-invalid'}`}
                                        placeholder='Password'
                                    />
                                    {errors.password &&
                                        <p className='invalid-feedback'>{errors.password.message}</p>
                                    }
                                </div>

                                <div className='d-flex justify-content-between align-items-center'>
                                    <button className='btn btn-primary'>Login</button>
                                    <Link to={`/account/register`} className='text-secondary'>
                                        Register Here
                                    </Link>
                                </div>

                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    )
}

export default Login