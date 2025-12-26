import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button Component', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick handler when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    fireEvent.click(screen.getByText('Click'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders disabled state correctly', () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByText('Disabled');
    expect(button).toBeDisabled();
  });

  it('applies primary variant classes by default', () => {
    render(<Button>Primary</Button>);
    const button = screen.getByText('Primary');
    expect(button).toHaveClass('bg-blue-600');
    expect(button).toHaveClass('text-white');
  });

  it('applies secondary variant classes correctly', () => {
    render(<Button variant="secondary">Secondary</Button>);
    const button = screen.getByText('Secondary');
    expect(button).toHaveClass('bg-gray-200');
    expect(button).toHaveClass('text-gray-900');
  });

  it('applies danger variant classes correctly', () => {
    render(<Button variant="danger">Delete</Button>);
    const button = screen.getByText('Delete');
    expect(button).toHaveClass('bg-red-600');
    expect(button).toHaveClass('text-white');
  });

  it('applies outline variant classes correctly', () => {
    render(<Button variant="outline">Outline</Button>);
    const button = screen.getByText('Outline');
    expect(button).toHaveClass('border-2');
    expect(button).toHaveClass('border-gray-300');
  });

  it('applies ghost variant classes correctly', () => {
    render(<Button variant="ghost">Ghost</Button>);
    const button = screen.getByText('Ghost');
    expect(button).toHaveClass('hover:bg-gray-100');
  });

  it('applies medium size by default', () => {
    render(<Button>Medium</Button>);
    const button = screen.getByText('Medium');
    expect(button).toHaveClass('h-11');
    expect(button).toHaveClass('px-6');
  });

  it('applies small size classes correctly', () => {
    render(<Button size="sm">Small</Button>);
    const button = screen.getByText('Small');
    expect(button).toHaveClass('h-9');
    expect(button).toHaveClass('px-3');
  });

  it('applies large size classes correctly', () => {
    render(<Button size="lg">Large</Button>);
    const button = screen.getByText('Large');
    expect(button).toHaveClass('h-12');
    expect(button).toHaveClass('px-8');
  });

  it('shows loading state correctly', () => {
    render(<Button isLoading>Save</Button>);
    expect(screen.getByText('Se încarcă...')).toBeInTheDocument();
    expect(screen.queryByText('Save')).not.toBeInTheDocument();
  });

  it('disables button when loading', () => {
    const handleClick = vi.fn();
    render(<Button isLoading onClick={handleClick}>Save</Button>);
    const button = screen.getByText('Se încarcă...');
    expect(button).toBeDisabled();
    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('applies custom className', () => {
    render(<Button className="custom-class">Custom</Button>);
    const button = screen.getByText('Custom');
    expect(button).toHaveClass('custom-class');
  });

  it('forwards ref correctly', () => {
    const ref = vi.fn();
    render(<Button ref={ref}>Button</Button>);
    expect(ref).toHaveBeenCalled();
  });
});
