import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';

interface Props {
  children: JSX.Element;
}

const RedirectIfAuthenticated = ({ children }: Props) => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const role = useSelector((state: RootState) => state.auth.role);
  const uid = useSelector((state: RootState) => state.auth.uid);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(), (user) => {
      if (user && uid && role) {
        console.log(role);
        switch (role) {
          case 'admin':
            navigate('/dashboard/admin', { replace: true });
            break;
          case 'worker':
            navigate('/dashboard/worker', { replace: true });
            break;
          case 'user':
            navigate('/dashboard/user', { replace: true });
            break;
          default:
            navigate('/', { replace: true });
        }
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [navigate, uid, role]);

  if (loading) return <div>Loading...</div>;

  return children;
};

export default RedirectIfAuthenticated;
