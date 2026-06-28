import { type Metadata } from 'next';

import { LoginForm } from './login-form';

export const metadata: Metadata = { title: 'Sign in' };

const LoginPage = () => <LoginForm />;

export default LoginPage;
