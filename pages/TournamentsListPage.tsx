import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTournaments } from '../hooks/useTournaments';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import { Tournament, TournamentStatus, NewTournamentData } from '../types';
import { ICONS } from '../constants';
import TournamentFormModal from '../components/tournaments/TournamentFormModal';

const TournamentsListPage: React.FC = () => {
  const { tournaments, addTournament, deleteTournament, updateTournament, isLoading } = useTournaments();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<TournamentStatus | 'All'>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTournament, setEditingTournament] = useState<Tournament | null>(null);

  const filteredTournaments = useMemo(() => {
    if (isLoading) return []; // Return empty if loading
    return tournaments.filter(tournament => {
      const matchesSearch = tournament.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterStatus === 'All' || tournament.status === filterStatus;
      return matchesSearch && matchesFilter;
    });
  }, [tournaments, searchTerm, filterStatus, isLoading]);

  const handleAddTournament = (data: NewTournamentData) => {
    addTournament(data);
    setIsModalOpen(false);
  };
  
  const handleEditTournament = (tournament: Tournament) => {
    setEditingTournament(tournament);
    setIsModalOpen(true);
  };

  const handleUpdateTournament = (data: NewTournamentData) => {
    if (editingTournament) {
      updateTournament(editingTournament.id, data);
    }
    setIsModalOpen(false);
    setEditingTournament(null);
  };
  
  const handleDeleteTournament = (id: string) => {
    // Ensure window.confirm is removed, as per previous step
    deleteTournament(id);
  };

  const openNewTournamentModal = () => {
    setEditingTournament(null);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-textSecondary text-lg">Cargando torneos...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold text-textPrimary">Torneos</h1>
        <Button onClick={openNewTournamentModal} leftIcon={ICONS.PLUS}>
          Nuevo Torneo
        </Button>
      </div>

      <Card>
        <div className="p-4 flex flex-col md:flex-row gap-4 border-b border-gray-200">
          <Input
            placeholder="Buscar torneos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={ICONS.SEARCH}
            className="flex-grow"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as TournamentStatus | 'All')}
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
          >
            <option value="All">Todos los Estados</option>
            {Object.values(TournamentStatus).map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

        {filteredTournaments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase">Nombre</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase">Estado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase">Fecha de Inicio</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase">Fecha de Fin</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-surface divide-y divide-gray-200">
                {filteredTournaments.map(tournament => (
                  <tr key={tournament.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link to={`/tournaments/${tournament.id}`} className="text-primary hover:underline font-medium">
                        {tournament.name}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap"><Badge status={tournament.status} /></td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-textSecondary">{tournament.startDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-textSecondary">{tournament.endDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                       <Button variant="ghost" size="sm" onClick={() => handleEditTournament(tournament)} title="Editar Torneo">
                         {ICONS.EDIT}
                       </Button>
                       <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700" onClick={() => handleDeleteTournament(tournament.id)} title="Eliminar Torneo">
                         {ICONS.TRASH}
                       </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center py-10 text-textSecondary">
            {tournaments.length === 0 ? "Aún no has creado ningún torneo. ¡Empieza creando uno!" : "No hay torneos que coincidan con tus criterios." }
          </p>
        )}
      </Card>
      <TournamentFormModal 
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingTournament(null); }}
        onSubmit={editingTournament ? handleUpdateTournament : handleAddTournament}
        initialData={editingTournament}
      />
    </div>
  );
};

export default TournamentsListPage;