import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '../i18n'; // side-effect init, same as App.tsx
import { AuthProvider } from '@/contexts/AuthContext';
import Auth from './Auth';

// No token in localStorage in this test environment, so AuthProvider's
// session-restore effect returns immediately without any network call.
describe('Auth page', () => {
    it('renders email and password fields', () => {
        render(
            <MemoryRouter initialEntries={['/auth']}>
                <AuthProvider>
                    <Auth />
                </AuthProvider>
            </MemoryRouter>
        );

        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    });
});