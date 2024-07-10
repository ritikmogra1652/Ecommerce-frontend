import  { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import axios from 'axios';
import endPoints, { backendApiUrl } from '../../constants/endPoints';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../state_management';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import routes from '../../constants/routes';
import { toastMessageSuccess } from '../utilities/CommonToastMessage';
import { bindActionCreators } from 'redux';
import { updateAuth } from '../../state_management/actions/authAction';
import './EditProfile.css'; // Import the CSS file

const schema = yup.object({
    username: yup.string().required("User name is required"),
    phone: yup.string().min(10, "Phone number must have 10 digits").max(10, "Phone number can have at most 10 digits").required('Phone number is required').matches(/^\d+$/, 'Invalid phone number'),
    // password: yup.string()
    //     .required()
    //     .min(8, 'Password must be at least 8 characters long')
    //     .matches(
    //         /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    //         'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    //     ),
    profileImage: yup.mixed<FileList>().required("Image is required"),
});

interface FormFields {
    username: string;
    phone: string;
    // password: string;
    profileImage: FileList;
}

export interface UserProfile {
    username: string;
    phone: string;
    // password: string;
    profileImage: string;
}

const EditProfile = () => {
    const jwtToken = useSelector((state: RootState) => state.AuthReducer.authData?.jwtToken);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { register, handleSubmit, reset, formState: { errors } } = useForm<FormFields>({
        resolver: yupResolver(schema)
    });
    const AuthStr = 'Bearer ' + jwtToken;
    const actions = bindActionCreators({ updateAuth }, dispatch);

    const fetchProfile = async () => {
        try {
            const response = await axios.get(
                `${backendApiUrl}${endPoints.MY_PROFILE}`,
                { headers: { Authorization: AuthStr } }
            );
            setProfile(response.data?.data);
            reset();
        } catch (error) {
            console.error('Error fetching profile data:', error);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, [reset]);

    const convertToBase64 = async (file: File): Promise<string | null> => {
        try {
            return new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result as string);
                reader.onerror = error => reject(error);
            });
        } catch (error) {
            console.error('Error converting image to base64:', error);
            return null;
        }
    };

    const onSubmit: SubmitHandler<FormFields> = async (data: FormFields) => {
        try {
            // let profileImageBase64 = profile?.profileImage || '';
            // if (data.profileImage && data.profileImage.length > 0) {
            //     const profileImageFile = data.profileImage[0];
            //     profileImageBase64 = await convertToBase64(profileImageFile) || '';
            // }

            let profileImageBase64 = '';

            if (data.profileImage && data.profileImage.length > 0) {
                const profileImageFile = data.profileImage[0];
                if (profileImageFile instanceof Blob) {
                    profileImageBase64 = await convertToBase64(profileImageFile) || '';
                } else {
                    throw new Error('Invalid file type');
                }
            }

            const profileData = {
                ...data,
                profileImage: profileImageBase64,
            };

            await axios.patch(
                `${backendApiUrl}${endPoints.UPDATE_MYPROFILE}`,
                profileData,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: AuthStr,
                    },
                }
            );
            toastMessageSuccess("Profile updated successfully");
            actions.updateAuth(data.username);
            navigate(routes.MYPROFILE);
            reset();
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile');
        }
    };

    return (
        <div className="edit-profile-container">
            <h2>Edit Profile</h2>
            {profile ? (
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <label htmlFor="username">Username</label>
                        <input {...register("username")} type="text" id="username" defaultValue={profile.username} />
                        {errors.username && <p>{errors.username.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="phone">Phone Number</label>
                        <input type="text" {...register('phone')} id="phone" defaultValue={profile.phone} />
                        {errors.phone && <p>{errors.phone.message}</p>}
                    </div>
                    {/* <div>
                        <label htmlFor="password">Password</label>
                        <input {...register("password")} type="password" id="password" />
                        {errors.password && <p>{errors.password.message}</p>}
                    </div> */}
                    <div>
                        <label htmlFor="profileImage">Profile Image</label>
                        <input {...register("profileImage")} type="file" id="profileImage" />
                        {errors.profileImage && <p>{errors.profileImage.message}</p>}
                    </div>
                    <button type="submit">Update Profile</button>
                </form>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default EditProfile;
