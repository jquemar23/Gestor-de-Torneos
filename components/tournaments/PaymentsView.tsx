import React from 'react';
import { Tournament, Team, PaymentStatusType } from '../../types';
import { useTournaments } from '../../hooks/useTournaments';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { ICONS } from '../../constants';

interface PaymentsViewProps {
  tournament: Tournament;
}

const PaymentsView: React.FC<PaymentsViewProps> = ({ tournament }) => {
  const { updateTeamPaymentStatus } = useTournaments();

  const handleTogglePaymentStatus = (teamId: string, currentStatus: PaymentStatusType) => {
    const newStatus: PaymentStatusType = currentStatus === 'Pagado' ? 'Pendiente' : 'Pagado';
    updateTeamPaymentStatus(tournament.id, teamId, newStatus);
  };

  const paidTeamsCount = tournament.teams.filter(team => team.paymentStatus === 'Pagado').length;
  const inscriptionFee = tournament.inscriptionFee || 0;
  const currentIncome = paidTeamsCount * inscriptionFee;
  const potentialIncome = tournament.teams.length * inscriptionFee;
  const pendingIncome = potentialIncome - currentIncome;

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' });
  };

  return (
    <Card title="Gestión de Pagos del Torneo">
      <div className="space-y-6">
        {/* Financial Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <InfoBox title="Precio de Inscripción" value={formatCurrency(inscriptionFee)} icon={ICONS.DOLLAR_SIGN} />
          <InfoBox title="Ingresos Actuales" value={formatCurrency(currentIncome)} icon={ICONS.DOLLAR_SIGN} color="text-emerald-600" />
          <InfoBox title="Ingresos Potenciales" value={formatCurrency(potentialIncome)} icon={ICONS.DOLLAR_SIGN} />
          <InfoBox title="Pendiente de Cobro" value={formatCurrency(pendingIncome)} icon={ICONS.DOLLAR_SIGN} color="text-amber-600" />
        </div>

        {/* Teams Payment List */}
        {tournament.teams.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase">Equipo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase">Estado del Pago</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-surface divide-y divide-gray-200">
                {tournament.teams.map((team: Team) => (
                  <tr key={team.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-textPrimary">{team.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge status={team.paymentStatus} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Button
                        size="sm"
                        variant={team.paymentStatus === 'Pagado' ? 'outline' : 'secondary'}
                        onClick={() => handleTogglePaymentStatus(team.id, team.paymentStatus)}
                      >
                        {team.paymentStatus === 'Pagado' ? 'Marcar como Pendiente' : 'Marcar como Pagado'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-textSecondary py-6">
            No hay equipos registrados en este torneo para gestionar pagos.
          </p>
        )}
      </div>
    </Card>
  );
};

// Fix: Changed icon prop type from React.ReactNode to React.ReactElement for better type safety with React.cloneElement.
// This resolves a TypeScript error where 'className' was not recognized as a valid prop
// when the generic props type 'P' in cloneElement<P> was inferred as 'unknown'.
interface InfoBoxProps {
    title: string;
    value: string | number;
    icon: React.ReactElement;
    color?: string;
}

const InfoBox: React.FC<InfoBoxProps> = ({ title, value, icon, color = 'text-primary' }) => (
    <div className="bg-white p-4 shadow rounded-lg flex items-center">
        <div className={`p-3 rounded-full bg-primary-light ${color} mr-4`}>
            {React.cloneElement(icon, { className: 'w-6 h-6'})}
        </div>
        <div>
            <p className="text-sm font-medium text-textSecondary">{title}</p>
            <p className={`text-xl font-semibold ${color}`}>{value}</p>
        </div>
    </div>
);


export default PaymentsView;