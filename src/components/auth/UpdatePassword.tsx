import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useState } from 'react';
import axios from "axios";
import routes from '../../constants/routes';
import endPoints, { backendApiUrl } from '../../constants/endPoints';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../state_management';
import { toastMessageSuccess } from '../utilities/CommonToastMessage';
import "./UpdatePassword.css";

const schema = yup.object({
    password: yup.string()
        .required()
        .min(8, 'Password must be at least 8 characters long')
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
        ),
});

interface FormFields {
    password: string,
}

const UpdatePassword = () => {
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const { register, handleSubmit, reset, formState: { errors } } = useForm<FormFields>({
        resolver: yupResolver(schema)
    });
    const jwtToken = useSelector((state: RootState) => state.AuthReducer.authData?.jwtToken);

    const navigate = useNavigate();

    const onSubmit: SubmitHandler<FormFields> = async (data: FormFields) => {
        try {
            const AuthStr = 'Bearer '.concat(jwtToken as string);
            await axios.patch(
                `${backendApiUrl}${endPoints.UPDATE_PASSWORD}`,
                data,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: AuthStr,
                    },
                }
            );

            toastMessageSuccess("Password updated successfully");

            navigate(routes.MYPROFILE);
            reset();
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 409) {
                    setErrorMessage("Category Already Registered");
                } else {
                    setErrorMessage("An error occurred. Please try again later.");
                }
            } else {
                setErrorMessage("An error occurred. Please try again later.");
            }
        }
    }

    return (
        <div className="update-password-container">
            <h1 className="update-password-title">Update Password</h1>
            <form className="update-password-form" onSubmit={handleSubmit(onSubmit)}>
                <label htmlFor="password" className="update-password-label">New Password</label>
                <input {...register("password")} type="password" id="password" name="password" className="update-password-input" />
                {errors.password && (<p className="update-password-error">{errors.password.message}</p>)}

                {errorMessage && <p className="update-password-error">{errorMessage}</p>}

                <button type="submit" className="update-password-submit">Update</button>
            </form>
        </div>
    );
}

export default UpdatePassword;
