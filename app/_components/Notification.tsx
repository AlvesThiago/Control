import React, { useEffect, useState } from 'react';

type NotificationProps = {
  message: string;
  type: 'success' | 'error';
};

const Notification: React.FC<NotificationProps> = ({ message, type }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 4700); // Inicia o fade-out um pouco antes do componente ser removido

    return () => clearTimeout(timer);
  }, []);

  const bgColor = type === 'success' ? 'bg-green-100' : 'bg-red-100';
  const textColor = type === 'success' ? 'text-green-800' : 'text-red-800';
  const borderColor = type === 'success' ? 'border-green-400' : 'border-red-400';

  return (
    <div
      className={`${bgColor} ${textColor} ${borderColor} border-l-4 p-4 mt-4 rounded transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      role="alert"
    >
      <p>{message}</p>
    </div>
  );
};

export default Notification;

