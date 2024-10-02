interface FullSpinnerProps {
  message?: string;
}
export const FullSpinner = ({ message }: FullSpinnerProps) => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="loading loading-spinner loading-lg opacity-20" />
      {message && <div className="text-white text-lg">{message}</div>}
    </div>
  );
};
