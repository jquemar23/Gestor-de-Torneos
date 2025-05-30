import React from 'react';
import { Link } from 'react-router-dom';
import { useTournaments } from '../hooks/useTournaments';
import { useAuth } from '../hooks/useAuth';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { Tournament, TournamentStatus } from '../types';
import { ICONS } from '../constants';

const DashboardPage: React.FC = () => {
  const { tournaments, isLoading } = useTournaments(); // Added isLoading
  const { userEmail } = useAuth();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-textSecondary text-lg">Cargando datos del torneo...</p>
      </div>
    );
  }

  const activeTournaments = tournaments.filter(t => t.status === TournamentStatus.ACTIVE).length;
  const totalMatches = tournaments.reduce((sum, t) => sum + t.matches.length, 0);
  const totalTeams = tournaments.reduce((sum, t) => sum + t.teams.length, 0);

  const recentTournaments = [...tournaments]
    .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
    .slice(0, 5);

  const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <Card className="flex-1">
      <div className="flex items-center">
        <div className="p-3 rounded-full bg-primary-light text-primary mr-4">
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-textSecondary">{title}</p>
          <p className="text-2xl font-semibold text-textPrimary">{value}</p>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-textPrimary">Panel Principal</h1>
      <p className="text-lg text-textSecondary">¡Bienvenido de nuevo, {userEmail || 'Organizador'}!</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Torneos Activos" value={activeTournaments} icon={ICONS.TROPHY} />
        <StatCard title="Partidos Programados Totales" value={totalMatches} icon={ICONS.CALENDAR} />
        <StatCard title="Equipos Registrados" value={totalTeams} icon={ICONS.USERS} />
      </div>

      <Card title="Actividad Reciente">
        {recentTournaments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">Torneo</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">Estado</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">Partidos</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">Equipos</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">Fecha de Inicio</th>
                </tr>
              </thead>
              <tbody className="bg-surface divide-y divide-gray-200">
                {recentTournaments.map((tournament: Tournament) => (
                  <tr key={tournament.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link to={`/tournaments/${tournament.id}`} className="text-primary hover:underline font-medium">
                        {tournament.name}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge status={tournament.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-textSecondary">{tournament.matches.length}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-textSecondary">{tournament.teams.length}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-textSecondary">{tournament.startDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-textSecondary text-center py-4">No hay actividad reciente para mostrar. ¡Crea tu primer torneo!</p>
        )}
      </Card>
    </div>
  );
};

export default DashboardPage;