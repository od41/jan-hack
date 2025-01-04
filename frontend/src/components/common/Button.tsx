interface ButtonProps {
    onClick?: () => void;
    children: React.ReactNode;
    disabled?: boolean;
    variant?: 'primary' | 'secondary';
    className?: string;
  }
  
  export const Button: React.FC<ButtonProps> = ({
    onClick,
    children,
    disabled = false,
    variant = 'primary',
    className = '',
  }) => {
    const baseStyles = 'px-4 py-2 rounded-lg font-semibold transition-colors';
    const variantStyles = {
      primary: 'bg-blue-600 text-white hover:bg-blue-700',
      secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    };
  
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      >
        {children}
      </button>
    );
  };
  