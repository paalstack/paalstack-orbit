import { type Metadata } from 'next';

import { SignupForm } from './signup-form';

export const metadata: Metadata = { title: 'Sign up' };

const SignupPage = () => <SignupForm />;

export default SignupPage;
