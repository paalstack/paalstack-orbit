import { type Metadata } from 'next';

import { ResetPasswordForm } from './reset-password-form';

export const metadata: Metadata = { title: 'Reset password' };

const ResetPasswordPage = () => <ResetPasswordForm />;

export default ResetPasswordPage;
