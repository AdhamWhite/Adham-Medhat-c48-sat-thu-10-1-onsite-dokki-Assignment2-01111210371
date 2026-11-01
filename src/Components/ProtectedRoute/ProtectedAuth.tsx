import { Navigate } from 'react-router-dom';

export default function ProtectedAuth({
  children,
}: {
  children: React.ReactNode;
}) {
if (localStorage.getItem('userToken')) {
    return <Navigate to={'/home'} />;
  } else {
    return <>{children}</>;
  }
}
