// Dashboard/ProfileCard.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const ProfileCard = () => {
    const { token } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/profile/`, {
                    idToken: token,
                });
                setProfile(res.data);
            } catch (err) {
                console.error('Error fetching profile:', err);
            } finally {
                setLoading(false);
            }
        };

        if (token) fetchProfile();
    }, [token]);

    if (loading) return <div className="text-sm text-gray-500">Loading profile...</div>;
    if (!profile) return <div className="text-sm text-gray-500">No profile info found.</div>;

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white/70 backdrop-blur-lg border border-orange-200 rounded-xl p-6 shadow-lg space-y-4"
        >
            {/* Avatar */}
            <div className="w-16 h-16 bg-orange-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto">
                {profile.full_name ? profile.full_name[0].toUpperCase() : 'U'}
            </div>

            {/* Info */}
            <div className="text-center">
                <h2 className="text-lg font-semibold text-gray-800">{profile.full_name}</h2>
                <p className="text-sm text-gray-600">{profile.email}</p>
            </div>

            {/* XP / Stats */}
            <div className="flex items-center justify-center gap-2 text-orange-600 mt-2 text-sm">
                <Zap size={16} />
                <span>{profile.total_xp || 0} XP</span>
            </div>
        </motion.div>
    );
};

export default ProfileCard;
