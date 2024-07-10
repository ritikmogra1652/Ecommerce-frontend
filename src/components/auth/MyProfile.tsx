import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../../state_management/index';
import routes from '../../constants/routes';
import endPoints, { backendApiUrl } from '../../constants/endPoints';
import { Link } from 'react-router-dom';
import './MyProfile.css'; // Import the CSS file

interface UserProfile {
    username: string;
    email: string;
    phone: string;
    profileImage: string;
}

const MyProfile: React.FC = () => {
    const jwtToken = useSelector((state: RootState) => state.AuthReducer?.authData?.jwtToken);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const AuthStr = 'Bearer ' + jwtToken;
                const response = await axios.get(
                    `${backendApiUrl}${endPoints.MY_PROFILE}`,
                    {
                        headers: {
                            Authorization: AuthStr,
                        },
                    }
                );
                const userDetails = response?.data?.data;
                setUserProfile(userDetails);
            } catch (error) {
                setError('Error fetching user profile');
            } finally {
                setLoading(false);
            }
        };

        if (jwtToken) {
            fetchUserProfile();
        } else {
            setLoading(false);
        }
    }, [jwtToken]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="profile-container">
            <h2>My Profile</h2>
            <div className="profile-details">
                <img src={userProfile?.profileImage} alt="Profile" />
                <p><strong>Name:</strong> {userProfile?.username}</p>
                <p><strong>Email:</strong> {userProfile?.email}</p>
                <p><strong>Phone:</strong> {userProfile?.phone}</p>
            </div>
            <div>
                <Link to={routes.EDIT_PROFILE}>Edit Profile</Link>
            </div>
            <div>
                <Link to={routes.UPDATE_PASSWORD}>UPDATE PASSWORD</Link>
            </div>
        </div>
    );
};

export default MyProfile;
