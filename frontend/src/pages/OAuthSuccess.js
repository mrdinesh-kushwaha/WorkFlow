import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const OAuthSuccess = () => {
    const [params] = useSearchParams();
    const navigate = useNavigate();
    const { handleOAuthLogin } = useAuth();

    useEffect(() => {
        const token = params.get('token');

        if (token) {
            handleOAuthLogin(token);

            setTimeout(() => {
                navigate('/dashboard');
            }, 500);
        } else {
            navigate('/login');
        }
    }, []);

    return (
        <div style={{
            height:'100vh',
            background:'#0f172a',
            display:'flex',
            alignItems:'center',
            justifyContent:'center',
            color:'#f1f5f9',
            fontSize:18
        }}>
            Signing you in...
        </div>
    );
};

export default OAuthSuccess;