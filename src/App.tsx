import { useEffect } from 'react';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import AppProviders from './providers/AppProviders';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import ResumeBuilder from './components/ResumeBuilder';
import Verify from './components/Verify';
import Explore from './components/Explore';
import Footer from './components/Footer';
import ToastContainer from './components/ToastContainer';
import { useResumeState } from './hooks/useResumeState';
import { useToast } from './hooks/useToast';

function AppContent() {
  const { account, connected } = useWallet();
  const resume = useResumeState();
  const { showToast } = useToast();

  // Sync wallet address to resume state
  useEffect(() => {
    if (connected && account?.address) {
      resume.setWalletAddress(account.address.toString());
    } else {
      resume.setWalletAddress(null);
    }
  }, [connected, account?.address]);

  const handleLoadProfile = (profile: { name: string; title: string; email: string; location: string; skills: readonly string[]; profileImage?: string }) => {
    resume.loadProfile(profile);
    if (profile.profileImage) {
      resume.updateIdentity('profileImage' as Parameters<typeof resume.updateIdentity>[0], profile.profileImage);
    }
    document.getElementById('app')?.scrollIntoView({ behavior: 'smooth' });
    showToast('Profile loaded - now customize it!', 'info');
  };

  return (
    <>
      <Navbar />
      <Hero />
      <HowItWorks />
      <ResumeBuilder
        identity={resume.identity}
        experience={resume.experience}
        education={resume.education}
        skills={resume.skills}
        updateIdentity={resume.updateIdentity}
        addExperience={resume.addExperience}
        updateExperience={resume.updateExperience}
        removeExperience={resume.removeExperience}
        addEducation={resume.addEducation}
        updateEducation={resume.updateEducation}
        removeEducation={resume.removeEducation}
        addSkill={resume.addSkill}
        removeSkill={resume.removeSkill}
        getResumeData={resume.getResumeData}
      />
      <Verify />
      <Explore onLoadProfile={handleLoadProfile} />
      <Footer />
      <ToastContainer />
    </>
  );
}

export default function App() {
  return (
    <AppProviders>
      <AppContent />
    </AppProviders>
  );
}
