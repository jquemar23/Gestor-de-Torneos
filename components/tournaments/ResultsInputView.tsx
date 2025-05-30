import React from 'react';
import { Tournament, TournamentStatus } from '../../types'; // Added TournamentStatus
import Card from '../ui/Card';
import { ICONS } from '../../constants';
import ScheduleView from './ScheduleView'; // Re-using ScheduleView for result input for simplicity

interface ResultsInputViewProps {
  tournament: Tournament;
}

const ResultsInputView: React.FC<ResultsInputViewProps> = ({ tournament }) => {
  if (tournament.status === TournamentStatus.COMPLETED) {
    return (
       <Card title="Ingreso de Resultados">
        <div className="text-center py-10 text-textSecondary">
          <p className="mb-2">{ICONS.INFO} Este torneo está completado. Los resultados no pueden ser modificados.</p>
          <p className="text-sm">Consulta los resultados en las pestañas de Calendario o Clasificación.</p>
        </div>
      </Card>
    );
  }
  
  return (
    <Card title="Ingreso de Resultados">
      <div className="text-center py-6 text-textSecondary bg-blue-50 p-4 rounded-md">
        <p className="mb-2 flex items-center justify-center gap-2">{ICONS.INFO} Para ingresar o editar resultados, por favor ve a la pestaña "Calendario".</p>
        <p className="text-sm">Encuentra el partido y haz clic en "Ingresar Resultado" o "Editar".</p>
      </div>
      <div className="mt-4">
        <h3 className="text-lg font-medium text-textPrimary mb-2">Vista Rápida del Calendario (por conveniencia):</h3>
         <ScheduleView tournament={tournament} />
      </div>
    </Card>
  );
};

export default ResultsInputView;