import React from 'react';
import { Tournament, Team } from '../../types';
import Card from '../ui/Card';
import { ICONS } from '../../constants';

interface StandingsViewProps {
  tournament: Tournament;
}

const StandingsView: React.FC<StandingsViewProps> = ({ tournament }) => {
  const getTeamPoints = (team: Team) => (team.wins * 3) + team.draws;

  const sortedTeams = [...tournament.teams].sort((a, b) => {
    const pointsA = getTeamPoints(a);
    const pointsB = getTeamPoints(b);
    if (pointsB !== pointsA) return pointsB - pointsA;
    // Add more tie-breaking rules if needed (e.g., goal difference)
    return a.name.localeCompare(b.name);
  });

  return (
    <Card title="Clasificación">
      {sortedTeams.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase">#</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase">Equipo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase" title="Partidos Jugados">PJ</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase" title="Victorias">V</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase" title="Empates">E</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase" title="Derrotas">D</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase">Pts</th>
              </tr>
            </thead>
            <tbody className="bg-surface divide-y divide-gray-200">
              {sortedTeams.map((team, index) => (
                <tr key={team.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-textSecondary">{index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-textPrimary">{team.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-textSecondary">{team.matchesPlayed}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-textSecondary">{team.wins}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-textSecondary">{team.draws}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-textSecondary">{team.losses}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-textPrimary">{getTeamPoints(team)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-10 text-textSecondary">
          <p className="mb-2">{ICONS.TROPHY} No hay equipos participando o aún no se han jugado partidos.</p>
          <p className="text-sm">La clasificación aparecerá aquí una vez que se completen los partidos.</p>
        </div>
      )}
    </Card>
  );
};

export default StandingsView;