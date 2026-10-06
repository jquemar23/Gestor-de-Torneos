import React from 'react';
import { Link } from 'react-router-dom';
import { useTournaments } from '../hooks/useTournaments';
import { useAuth } from '../hooks/useAuth';
import { Tournament, TournamentStatus } from '../types';
import { ICONS } from '../constants';
import Badge from '../components/ui/Badge';

const DashboardPage: React.FC = () => {
  const { tournaments, isLoading } = useTournaments(); // Added isLoading
  const { userEmail } = useAuth();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64" role="status">
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
    <article className="stat-card">
      <div className="stat-icon" aria-hidden="true">{icon}</div>
      <div>
        <p className="stat-label">{title}</p>
        <p className="stat-value">{value}</p>
      </div>
    </article>
  );

  return (
    <div className="space-y-8">
      <section className="dashboard-intro">
        <div className="dashboard-intro-copy">
          <span className="eyebrow">Centro de control</span>
          <h1>Tu temporada, bajo control.</h1>
          <p>¡Bienvenido de nuevo, {userEmail || 'Organizador'}!</p>
        </div>
        <div className="dashboard-date">{tournaments.length} {tournaments.length === 1 ? 'torneo en total' : 'torneos en total'}</div>
      </section>

      <div className="stat-grid">
        <StatCard title="Torneos Activos" value={activeTournaments} icon={ICONS.TROPHY} />
        <StatCard title="Partidos Programados Totales" value={totalMatches} icon={ICONS.CALENDAR} />
        <StatCard title="Equipos Registrados" value={totalTeams} icon={ICONS.USERS} />
      </div>

      <section className="surface-panel">
        <div className="surface-heading"><h2>Actividad reciente</h2></div>
        <div className="surface-content">
        {recentTournaments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="modern-table">
              <thead>
                <tr>
                  <th scope="col">Torneo</th>
                  <th scope="col">Estado</th>
                  <th scope="col">Partidos</th>
                  <th scope="col">Equipos</th>
                  <th scope="col">Fecha de inicio</th>
                </tr>
              </thead>
              <tbody>
                {recentTournaments.map((tournament: Tournament) => (
                  <tr key={tournament.id}>
                    <td>
                      <Link to={`/tournaments/${tournament.id}`}>
                        {tournament.name}
                      </Link>
                    </td>
                    <td>
                      <Badge status={tournament.status} />
                    </td>
                    <td>{tournament.matches.length}</td>
                    <td>{tournament.teams.length}</td>
                    <td>{tournament.startDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-textSecondary text-center py-8">No hay actividad reciente para mostrar. ¡Crea tu primer torneo!</p>
        )}
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;