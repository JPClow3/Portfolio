import React from 'react';
import {useLanguage} from '../context/AppContext';
import {portfolioData} from '../data';
import {ProfileCard, Section} from './VisualComponents';
import avatar from '../assets/avatar.svg';

const Profile = () => {
    const { language } = useLanguage();
    const {profile} = portfolioData[language];

    const handleContactClick = () => {
        window.open('https://www.linkedin.com/in/joaopaulo-goncalves-santos/', '_blank');
    };

    return (
        <Section id="profile" title={profile.title}>
            <div className="flex justify-center">
                <ProfileCard
                    name="João Paulo Gonçalves Santos"
                    title="Software Engineer"
                    handle="joaopaulo-goncalves-santos"
                    status={profile.card.status}
                    contactText={profile.card.contactText}
                    avatarUrl={avatar}
                    onContactClick={handleContactClick}
                />
            </div>
        </Section>
    );
};

export default Profile;