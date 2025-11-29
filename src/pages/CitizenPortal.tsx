import { useNavigate } from 'react-router-dom';
import { CitizenPortal } from '@/components/CitizenPortal';

const CitizenPortalPage = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
  };

  return <CitizenPortal onBack={handleBack} />;
};

export default CitizenPortalPage;
