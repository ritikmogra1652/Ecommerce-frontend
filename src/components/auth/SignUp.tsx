import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from "axios";
import routes from '../../constants/routes';
import endPoints, { backendApiUrl } from '../../constants/endPoints';
import './SignUp.css';

const schema = yup.object({
    username: yup.string().required("User name is required"),
    email: yup.string().email("Email format is not valid").required("Email is required"),
    phone: yup.string().min(10, "Phone number must have 10 digits").max(10, "Phone number can have at most 10 digits").required('Phone number is required').matches(/^\d+$/, 'Invalid phone number'),
    password: yup.string()
        .required('Password is required')
        .min(8, 'Password must be at least 8 characters long')
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
        ),
    profileImage: yup.mixed<FileList>()
        .required("Profile image is required")
        .test('filePresent', 'Profile image is required', value => value && value.length > 0),
});



interface FormFields {
    username: string,
    email: string,
    phone: string,
    password: string,
    profileImage: FileList
}

const SignUp = () => {
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const { register, handleSubmit, formState: { errors } } = useForm<FormFields>({
        resolver: yupResolver(schema)
    });

    const navigate = useNavigate();

    const convertToBase64 = (file: File) => {
        return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
        });
    };

    const onSubmit: SubmitHandler<FormFields> = async (data: FormFields) => {
        try {
            const profileImageFile = data.profileImage[0];
            let profileImageBase64 = null;

            if (profileImageFile) {
                profileImageBase64 = await convertToBase64(profileImageFile);
            }

            const formData = {
                ...data,
                profileImage: profileImageBase64,
            };

            await axios.post(
                `${backendApiUrl}${endPoints.SIGN_UP}`,
                formData,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            
            navigate(routes.LOGIN);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 409) {
                    setErrorMessage("User Already Registered");
                } else {
                    setErrorMessage("An error occurred. Please try again later.");
                }
            } else {
                setErrorMessage("An error occurred. Please try again later.");
            }
        }
    }

    return (
        <div className="signup__container">
            <h1 className="signup__title">Sign Up</h1>
            <form className="signup__form" onSubmit={handleSubmit(onSubmit)}>
                <label className="signup__label" htmlFor="username">Username</label>
                <input className="signup__input" {...register("username")} type="text" id="username" name="username" />
                {errors.username && (<p className="signup__error-message">{errors.username.message}</p>)}

                <label className="signup__label" htmlFor="phone">Phone Number</label>
                <input className="signup__input" type="text" {...register('phone')} id="phone" />
                {errors.phone && <p className="signup__error-message">{errors.phone.message}</p>}

                <label className="signup__label" htmlFor="email">Email</label>
                <input className="signup__input" {...register("email")} type="email" id="email" name="email" />
                {errors.email && (<p className="signup__error-message">{errors.email.message}</p>)}

                <label className="signup__label" htmlFor="password">Password</label>
                <input className="signup__input" {...register("password")} type="password" id="password" name="password" />
                {errors.password && (<p className="signup__error-message">{errors.password.message}</p>)}

                <label className="signup__label" htmlFor="profileImage">Profile Image</label>
                <input className="signup__input" {...register("profileImage")} type="file" id="profileImage" name="profileImage" accept='image/*' />
                {errors.profileImage && (<p className="signup__error-message">{errors.profileImage.message}</p>)}

                {errorMessage && <p className="signup__error-message">{errorMessage}</p>}

                <button className="signup__button" type="submit">Submit</button>
            </form>

            <p className="signup__message">Already have an account? <Link to={routes.LOGIN}>Login</Link></p>
        </div>
    );
}

export default SignUp;
