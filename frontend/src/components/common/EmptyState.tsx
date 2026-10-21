import React from 'react';
import { Compass } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionText,
  onAction,
  icon
}) => {
  return (
    <div className="text-center py-16 px-4 max-w-md mx-auto">
      <div className="w-16 h-16 mx-auto mb-4 bg-brand-50 rounded-2xl flex items-center justify-center text-brand-500 shadow-inner">
        {icon || <Compass className="w-8 h-8 stroke-[1.5]" />}
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 mb-6 leading-relaxed">{description}</p>
      {actionText && onAction && (
        <Button onClick={onAction} variant="primary">
          {actionText}
        </Button>
      )}
    </div>
  );
};
