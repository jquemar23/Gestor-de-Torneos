import React, { useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { Team, Player, PlayerStatus, NewPlayerData } from '../../types';
import { useTournaments } from '../../hooks/useTournaments';
import { ICONS } from '../../constants';
import PlayerFormModal from './PlayerFormModal';

interface PlayerManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  tournamentId: string;
  team: Team;
}

const PlayerManagementModal: React.FC<PlayerManagementModalProps> = ({ isOpen, onClose, tournamentId, team }) => {
  const { addPlayerToTeam, updatePlayerInTeam, removePlayerFromTeam } = useTournaments();
  const [isPlayerFormOpen, setIsPlayerFormOpen] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);

  const handleAddPlayer = (playerData: NewPlayerData) => {
    addPlayerToTeam(tournamentId, team.id, playerData);
  };

  const handleEditPlayer = (player: Player) => {
    setEditingPlayer(player);
    setIsPlayerFormOpen(true);
  };

  const handleUpdatePlayer = (playerData: NewPlayerData) => {
    if (editingPlayer) {
      updatePlayerInTeam(tournamentId, team.id, editingPlayer.id, playerData);
    }
    setIsPlayerFormOpen(false);
    setEditingPlayer(null);
  };

  const handleDeletePlayer = (playerId: string) => {
    // Removed window.confirm
    removePlayerFromTeam(tournamentId, team.id, playerId);
  };

  const openNewPlayerModal = () => {
    setEditingPlayer(null);
    setIsPlayerFormOpen(true);
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title={`Gestionar Plantilla: ${team.name}`} size="lg">
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={openNewPlayerModal} leftIcon={ICONS.PLUS}>Añadir Jugador</Button>
          </div>
          {team.roster.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-textSecondary uppercase">Nombre</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-textSecondary uppercase">Rol</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-textSecondary uppercase">Estado</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-textSecondary uppercase">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-surface divide-y divide-gray-200">
                  {team.roster.map(player => (
                    <tr key={player.id}>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-textPrimary">{player.name}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-textSecondary">{player.role}</td>
                      <td className="px-4 py-2 whitespace-nowrap"><Badge status={player.status} /></td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm space-x-1">
                        <Button variant="ghost" size="sm" onClick={() => handleEditPlayer(player)} title="Editar Jugador">{ICONS.EDIT}</Button>
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700" onClick={() => handleDeletePlayer(player.id)} title="Eliminar Jugador">{ICONS.TRASH}</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-textSecondary py-4">Aún no hay jugadores en este equipo.</p>
          )}
          <div className="flex justify-end pt-2">
            <Button variant="outline" onClick={onClose}>Cerrar</Button>
          </div>
        </div>
      </Modal>
      {isPlayerFormOpen && (
        <PlayerFormModal
            isOpen={isPlayerFormOpen}
            onClose={() => { setIsPlayerFormOpen(false); setEditingPlayer(null);}}
            onSubmit={editingPlayer ? handleUpdatePlayer : handleAddPlayer}
            initialData={editingPlayer}
        />
      )}
    </>
  );
};

export default PlayerManagementModal;