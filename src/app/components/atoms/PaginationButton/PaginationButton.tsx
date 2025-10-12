interface PaginationButtonProps {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}

export const PaginationButton: React.FC<PaginationButtonProps> = ({
  onClick,
  disabled = false,
  children,
}) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className="px-5 py-1 bg-white border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 hover:border-gray-400 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-300 transition-all duration-200 shadow-sm cursor-pointer"
    >
      {children}
    </button>
  );
};
