const Backdrop = ({ onClose = () => {}, children,classes }) => {
  const stopPropagation = (e) => {
    e.stopPropagation();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30"
      onClick={onClose}
    >
      <div
        className={`absolute right-auto top-20 bg-gray-200 p-5 rounded-lg shadow-xl w-full ${classes}`}
        onClick={stopPropagation}
      >
        {children}
      </div>
    </div>
  );
};

export default Backdrop;
