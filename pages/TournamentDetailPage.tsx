import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTournaments } from '../hooks/useTournaments';
import TournamentInfo from '../components/tournaments/TournamentInfo';
import TeamManagement from '../components/tournaments/TeamManagement';
import ScheduleView from '../components/tournaments/ScheduleView';
import StandingsView from '../components/tournaments/StandingsView';
import ResultsInputView from '../components/tournaments/ResultsInputView';
import PaymentsView from '../components/tournaments/PaymentsView'; // Added
import Button from '../components/ui/Button';
import { ICONS } from '../constants';
import TournamentFormModal from '../components/tournaments/TournamentFormModal';
import { NewTournamentData } from '../types';


type TabKey = 'overview' | 'teams' | 'schedule' | 'standings' | 'results' | 'payments'; // Added 'payments'

const TournamentDetailPage: React.FC = () => {
  const { tournamentId } = useParams<{ tournamentId: string }>();
  const navigate = useNavigate();
  const { getTournamentById, updateTournament } = useTournaments();
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const tournament = tournamentId ? getTournamentById(tournamentId) : undefined;

  if (!tournament) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-semibold text-red-600">Torneo No Encontrado</h2>
        <p className="text-textSecondary mt-2">El torneo que estás buscando no existe o ha sido eliminado.</p>
        <Button onClick={() => navigate('/tournaments')} className="mt-4" variant="outline">
          Volver a Torneos
        </Button>
      </div>
    );
  }
  
  const handleUpdateTournament = (data: NewTournamentData) => {
    updateTournament(tournament.id, data);
    setIsEditModalOpen(false);
  };


  const TabButton: React.FC<{ tabKey: TabKey; label: string }> = ({ tabKey, label }) => (
    <button
      onClick={() => setActiveTab(tabKey)}
      className={`px-4 py-2 font-medium text-sm rounded-md transition-colors
        ${activeTab === tabKey 
          ? 'bg-primary text-white' 
          : 'text-textSecondary hover:bg-gray-200 hover:text-textPrimary'}`}
    >
      {label}
    </button>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <Link to="/tournaments" className="text-sm text-primary hover:underline flex items-center mb-1">
            {ICONS.ARROW_LEFT} <span className="ml-1">Volver a Torneos</span>
          </Link>
          <h1 className="text-3xl font-bold text-textPrimary">{tournament.name}</h1>
        </div>
        <Button onClick={() => setIsEditModalOpen(true)} variant="secondary" leftIcon={ICONS.EDIT}>
            Gestionar Detalles del Torneo
        </Button>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-3 mb-6">
        <TabButton tabKey="overview" label="Resumen" />
        <TabButton tabKey="teams" label="Equipos" />
        <TabButton tabKey="schedule" label="Calendario" />
        <TabButton tabKey="standings" label="Clasificación" />
        <TabButton tabKey="results" label="Ingresar Resultados" />
        <TabButton tabKey="payments" label="Pagos" /> {/* Added Payments Tab */}
      </div>

      <div>
        {activeTab === 'overview' && <TournamentInfo tournament={tournament} />}
        {activeTab === 'teams' && <TeamManagement tournament={tournament} />}
        {activeTab === 'schedule' && <ScheduleView tournament={tournament} />}
        {activeTab === 'standings' && <StandingsView tournament={tournament} />}
        {activeTab === 'results' && <ResultsInputView tournament={tournament} />}
        {activeTab === 'payments' && <PaymentsView tournament={tournament} />} {/* Added Payments View Rendering */}
      </div>
      
      <TournamentFormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleUpdateTournament}
        initialData={tournament}
      />
    </div>
  );
};

export default TournamentDetailPage;