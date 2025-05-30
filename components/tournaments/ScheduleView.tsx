import React, { useState } from 'react';
import { Tournament, Match, Team, MatchStatus, TournamentStatus } from '../../types'; // Added MatchStatus, TournamentStatus
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { ICONS } from '../../constants';
import { useTournaments } from '../../hooks/useTournaments';
import MatchFormModal from './MatchFormModal';

interface ScheduleViewProps {
  tournament: Tournament;
}

const ScheduleView: React.FC<ScheduleViewProps> = ({ tournament }) => {
  const { addMatchToTournament, updateMatchInTournament, updateTeamInTournament } = useTournaments();
  const [isMatchFormOpen, setIsMatchFormOpen] = useState(false);
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);

  const handleAddMatch = (matchData: Omit<Match, 'id' | 'tournamentId' | 'teamAName' | 'teamBName' | 'status'>) => {
    addMatchToTournament(tournament.id, {...matchData, status: MatchStatus.SCHEDULED});
  };

  const handleEditMatch = (match: Match) => {
    setEditingMatch(match);
    setIsMatchFormOpen(true);
  };

  const handleUpdateMatch = (matchData: Omit<Match, 'id' | 'tournamentId' | 'teamAName' | 'teamBName' | 'status'>, isResultUpdate: boolean) => {
    if (editingMatch) {
        const newStatus: MatchStatus = (matchData.scoreA !== null && matchData.scoreB !== null) ? MatchStatus.COMPLETED : MatchStatus.SCHEDULED;
        const updatedMatchData: Partial<Match> = { ...matchData, status: newStatus };
        updateMatchInTournament(tournament.id, editingMatch.id, updatedMatchData);

        // Only update team stats if the match was previously scheduled and is now completed
        if (newStatus === MatchStatus.COMPLETED && editingMatch.status === MatchStatus.SCHEDULED) { 
            const teamA = tournament.teams.find(t => t.id === matchData.teamAId);
            const teamB = tournament.teams.find(t => t.id === matchData.teamBId);

            if (teamA && teamB && matchData.scoreA !== null && matchData.scoreB !== null) {
                const teamAUpdates: Partial<Team> = { matchesPlayed: (teamA.matchesPlayed || 0) + 1 };
                const teamBUpdates: Partial<Team> = { matchesPlayed: (teamB.matchesPlayed || 0) + 1 };

                if (matchData.scoreA > matchData.scoreB) {
                    teamAUpdates.wins = (teamA.wins || 0) + 1;
                    teamBUpdates.losses = (teamB.losses || 0) + 1;
                } else if (matchData.scoreB > matchData.scoreA) {
                    teamBUpdates.wins = (teamB.wins || 0) + 1;
                    teamAUpdates.losses = (teamA.losses || 0) + 1;
                } else {
                    teamAUpdates.draws = (teamA.draws || 0) + 1;
                    teamBUpdates.draws = (teamB.draws || 0) + 1;
                }
                updateTeamInTournament(tournament.id, teamA.id, teamAUpdates);
                updateTeamInTournament(tournament.id, teamB.id, teamBUpdates);
            }
        }
    }
    setIsMatchFormOpen(false);
    setEditingMatch(null);
  };
  
  const openNewMatchModal = () => {
    if (tournament.teams.length < 2) {
      alert("Necesitas al menos dos equipos en el torneo para programar un partido.");
      return;
    }
    setEditingMatch(null);
    setIsMatchFormOpen(true);
  };


  const sortedMatches = [...tournament.matches].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime() || a.time.localeCompare(b.time));

  return (
    <>
    <Card title="Calendario de Partidos" actions={tournament.status !== TournamentStatus.COMPLETED ? <Button onClick={openNewMatchModal} leftIcon={ICONS.PLUS}>Programar Partido</Button> : null}>
      {sortedMatches.length > 0 ? (
         <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase">Fecha y Hora</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase">Partido</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase">Marcador</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase">Estado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-surface divide-y divide-gray-200">
                {sortedMatches.map(match => (
                  <tr key={match.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-textSecondary">{match.date} <br/> {match.time}</td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-textPrimary">
                        {match.teamAName || tournament.teams.find(t=>t.id === match.teamAId)?.name || 'Equipo A'} vs {match.teamBName || tournament.teams.find(t=>t.id === match.teamBId)?.name || 'Equipo B'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-textSecondary">
                      {match.scoreA !== null && match.scoreB !== null ? `${match.scoreA} - ${match.scoreB}` : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap"><Badge status={match.status} /></td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {tournament.status !== TournamentStatus.COMPLETED && (
                        <Button variant="outline" size="sm" onClick={() => handleEditMatch(match)}>
                          {match.status === MatchStatus.SCHEDULED ? 'Ingresar Resultado' : 'Editar'}
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
      ) : (
        <div className="text-center py-10 text-textSecondary">
          <p className="mb-2">{ICONS.CALENDAR} Aún no hay partidos programados para este torneo.</p>
          {tournament.status !== TournamentStatus.COMPLETED && tournament.teams.length >=2 && <Button onClick={openNewMatchModal} variant="secondary">Programar Primer Partido</Button>}
          {tournament.status !== TournamentStatus.COMPLETED && tournament.teams.length < 2 && <p className="text-sm">Añade al menos dos equipos para programar partidos.</p>}
        </div>
      )}
    </Card>
    {isMatchFormOpen && (
        <MatchFormModal
            isOpen={isMatchFormOpen}
            onClose={() => {setIsMatchFormOpen(false); setEditingMatch(null);}}
            onSubmit={editingMatch ? handleUpdateMatch : handleAddMatch}
            tournament={tournament}
            initialData={editingMatch}
        />
    )}
    </>
  );
};

export default ScheduleView;