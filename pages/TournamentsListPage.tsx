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
      <div className="flex justify-center items-center h-64" role="status">
        <p className="text-textSecondary text-lg">Cargando torneos...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="eyebrow">Competiciones</span>
          <h1 className="page-title">Torneos</h1>
          <p className="page-subtitle">Administra tus competiciones y consulta su actividad.</p>
        </div>
        <Button onClick={openNewTournamentModal} leftIcon={ICONS.PLUS}>
          Crear torneo
        </Button>
      </div>

      <section className="surface-panel">
        <div className="tournament-toolbar">
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
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Estado</th>
                  <th>Fecha de inicio</th>
                  <th>Fecha de fin</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredTournaments.map(tournament => (
                  <tr key={tournament.id}>
                    <td>
                      <Link to={`/tournaments/${tournament.id}`}>
                        {tournament.name}
                      </Link>
                    </td>
                    <td><Badge status={tournament.status} /></td>
                    <td>{tournament.startDate}</td>
                    <td>{tournament.endDate}</td>
                    <td>
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
      </section>
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