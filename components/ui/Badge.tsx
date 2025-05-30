import React from 'react';
import { TournamentStatus, PlayerStatus, MatchStatus, PaymentStatusType } from '../../types';

interface BadgeProps {
  status: TournamentStatus | PlayerStatus | MatchStatus | PaymentStatusType | string;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ status, className = '' }) => {
  let colorClasses = '';

  switch (status) {
    case TournamentStatus.ACTIVE:
    case PlayerStatus.ACTIVE:
      colorClasses = 'bg-green-100 text-green-800';
      break;
    case 'Pagado': // PaymentStatusType
      colorClasses = 'bg-emerald-100 text-emerald-800';
      break;
    case TournamentStatus.COMPLETED:
    case MatchStatus.COMPLETED:
      colorClasses = 'bg-blue-100 text-blue-800';
      break;
    case TournamentStatus.SCHEDULED:
    case MatchStatus.SCHEDULED:
      colorClasses = 'bg-yellow-100 text-yellow-800';
      break;
    case 'Pendiente': // PaymentStatusType
      colorClasses = 'bg-amber-100 text-amber-800';
      break;
    case PlayerStatus.INACTIVE:
      colorClasses = 'bg-red-100 text-red-800';
      break;
    default:
      colorClasses = 'bg-gray-100 text-gray-800';
  }

  return (
    <span
      className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClasses} ${className}`}
    >
      {status}
    </span>
  );
};

export default Badge;