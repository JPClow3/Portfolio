import React from 'react';
import { useLanguage } from '../context/AppContext';
import { portfolioData } from '../data';
import { Section, FadeInOnScroll, ProfileCard } from './VisualComponents';
// Lembre-se de ter sua imagem em src/assets/avatar.png ou .svg
import avatarImage from '../assets/avatar.svg';

const Profile = () => {
    const { language } = useLanguage();
    const { profile, hero } = portfolioData[language];
    const handleContactClick = () => { window.open("https://www.linkedin.com/in/joaopaulosantosgo/", "_blank", "noopener,noreferrer"); };

    return (
        <Section id="profile" title={profile.title}>
            <div className="flex justify-center">
                <FadeInOnScroll>
                    <ProfileCard
                        name={hero.name}
                        title={hero.title}
                        status={profile.card.status}
                        contactText={profile.card.contactText}
                        onContactClick={handleContactClick}
                        avatarUrl={avatarImage}
                    />
                </FadeInOnScroll>
            </div>
        </Section>
    );
};

export default Profile;
