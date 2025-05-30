import React, { useState } from 'react';
import { Tournament, Team, NewTeamData } from '../../types';
import { useTournaments } from '../../hooks/useTournaments';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { ICONS } from '../../constants';
import TeamFormModal from './TeamFormModal';
import PlayerManagementModal from './PlayerManagementModal';

interface TeamManagementProps {
  tournament: Tournament;
}

const TeamManagement: React.FC<TeamManagementProps> = ({ tournament }) => {
  const { addTeamToTournament, updateTeamInTournament, removeTeamFromTournament } = useTournaments();
  const [isTeamFormOpen, setIsTeamFormOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [managingRosterTeam, setManagingRosterTeam] = useState<Team | null>(null);

  const handleAddTeam = (teamData: NewTeamData) => {
    addTeamToTournament(tournament.id, teamData);
  };

  const handleEditTeam = (team: Team) => {
    setEditingTeam(team);
    setIsTeamFormOpen(true);
  };
  
  const handleUpdateTeam = (teamData: NewTeamData) => {
    if (editingTeam) {
      updateTeamInTournament(tournament.id, editingTeam.id, teamData);
    }
    setIsTeamFormOpen(false);
    setEditingTeam(null);
  };

  const handleDeleteTeam = (teamId: string) => {
    // Removed window.confirm
    removeTeamFromTournament(tournament.id, teamId);
  };

  const openNewTeamModal = () => {
    setEditingTeam(null);
    setIsTeamFormOpen(true);
  };
  
  const getTeamPoints = (team: Team) => (team.wins * 3) + team.draws;

  return (
    <>
      <Card title="Equipos" actions={<Button onClick={openNewTeamModal} leftIcon={ICONS.PLUS}>Añadir Equipo</Button>}>
        {tournament.teams.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase">Nombre</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase">Jugadores</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase" title="Partidos Jugados">PJ</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase" title="Victorias">V</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase" title="Derrotas">D</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase" title="Empates">E</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase">Pts</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-surface divide-y divide-gray-200">
                {tournament.teams.map(team => (
                  <tr key={team.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-textPrimary">{team.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-textSecondary">{team.roster.length}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-textSecondary">{team.matchesPlayed}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-textSecondary">{team.wins}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-textSecondary">{team.losses}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-textSecondary">{team.draws}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-textPrimary">{getTeamPoints(team)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm space-x-1">
                      <Button variant="outline" size="sm" onClick={() => setManagingRosterTeam(team)}>Gestionar Plantilla</Button>
                      <Button variant="ghost" size="sm" onClick={() => handleEditTeam(team)} title="Editar Equipo">{ICONS.EDIT}</Button>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700" onClick={() => handleDeleteTeam(team.id)} title="Eliminar Equipo">{ICONS.TRASH}</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-textSecondary py-6">Aún no hay equipos registrados para este torneo.</p>
        )}
      </Card>

      {isTeamFormOpen && (
        <TeamFormModal
          isOpen={isTeamFormOpen}
          onClose={() => {setIsTeamFormOpen(false); setEditingTeam(null);}}
          onSubmit={editingTeam ? handleUpdateTeam : handleAddTeam}
          initialData={editingTeam}
        />
      )}
      {managingRosterTeam && (
        <PlayerManagementModal
          isOpen={!!managingRosterTeam}
          onClose={() => setManagingRosterTeam(null)}
          tournamentId={tournament.id}
          team={managingRosterTeam}
        />
      )}
    </>
  );
};

export default TeamManagement;