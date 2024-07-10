import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from 'axios';
import endPoints, { backendApiUrl } from '../../constants/endPoints';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { IUserData } from '../../interface/commonInterfaces';
import { logInAction } from '../../state_management/actions/authAction';
import { bindActionCreators } from 'redux';
import { useState } from 'react';
import routes from '../../constants/routes';
import { toastMessageSuccess } from '../utilities/CommonToastMessage';
import './Login.css'

const schema = yup.object({
    email: yup.string().email("Email format is not valid").required("Email is Required"),
    password: yup.string().required().min(8, "Password must be at least 8 characters"),
})

type FormFields = {
    email: string,
    password: string
}

const Login = () => {
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const { register, handleSubmit, formState: { errors } } = useForm<FormFields>({
        resolver: yupResolver(schema)
    })

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const actions = bindActionCreators(
        {
            logInAction,
        },
        dispatch
    );

    const onSubmit: SubmitHandler<FormFields> = async (data: FormFields) => {
        try {
            const response = await axios.post(
                `${backendApiUrl}${endPoints.LOGIN}`,
                data,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            const userDetails = response?.data?.data?.userExists;
            const token = response?.data?.data?.token;
            const authData: IUserData = {
                username: userDetails.username,
                email: userDetails.email,
                role: userDetails.role,
                jwtToken: token,
            };
            actions.logInAction(authData);
            toastMessageSuccess("User logged in successfully");
            navigate(routes.HOMEPAGE);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 409) {
                    setErrorMessage("Invalid email or password. Please try again.");
                } else {
                    setErrorMessage("An error occurred. Please try again later.");
                }
            } else {
                setErrorMessage("An error occurred. Please try again later.");
            }
        }
    }

    return (
        <div className="login__container">
            <h1 className="login__title">Login</h1>

            <form className="login__form" onSubmit={handleSubmit(onSubmit)}>

                <label className="login__label" htmlFor="email">Email</label>
                <input className="login__input" {...register("email")} type="email" id="email" name="email" />

                <p className="login__error-message">{errors.email && (<div>{errors.email.message}</div>)}</p>

                <label className="login__label" htmlFor="password">Password</label>
                <input className="login__input" {...register("password")} type="password" id="password" name="password" />

                <p className="login__error-message">{errors.password && (<div>{errors.password.message}</div>)}</p>
                {errorMessage && <p className="login__error-message">{errorMessage}</p>}
                <button className="login__button">Submit</button>
            </form>
        </div>
    )
}

export default Login;