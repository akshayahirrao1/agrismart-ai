import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import InputField from '@/components/InputField';

describe('InputField', () => {
    it('renders the label', () => {
        render(<InputField label="Temperature" value="" onChange={() => { }} />);
        expect(screen.getByText('Temperature')).toBeInTheDocument();
    });

    it('shows an error message when provided', () => {
        render(
            <InputField
                label="Humidity"
                value=""
                onChange={() => { }}
                error="Humidity must be between 0-100%"
            />
        );
        expect(screen.getByText('Humidity must be between 0-100%')).toBeInTheDocument();
    });

    it('calls onChange when the user types', () => {
        const handleChange = vi.fn();
        render(<InputField label="Rainfall" value="" onChange={handleChange} />);

        const input = screen.getByLabelText('Rainfall');
        fireEvent.change(input, { target: { value: '150' } });
        expect(handleChange).toHaveBeenCalled();
    });
});