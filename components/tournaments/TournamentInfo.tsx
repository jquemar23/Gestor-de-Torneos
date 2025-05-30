import React from 'react';
import { Tournament } from '../../types';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

interface TournamentInfoProps {
  tournament: Tournament;
}

const TournamentInfo: React.FC<TournamentInfoProps> = ({ tournament }) => {
  return (
    <Card title="Resumen del Torneo">
      <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
        <div className="sm:col-span-1">
          <dt className="text-sm font-medium text-textSecondary">Nombre</dt>
          <dd className="mt-1 text-lg text-textPrimary">{tournament.name}</dd>
        </div>
        <div className="sm:col-span-1">
          <dt className="text-sm font-medium text-textSecondary">Estado</dt>
          <dd className="mt-1 text-lg text-textPrimary"><Badge status={tournament.status} /></dd>
        </div>
        <div className="sm:col-span-1">
          <dt className="text-sm font-medium text-textSecondary">Fecha de Inicio</dt>
          <dd className="mt-1 text-lg text-textPrimary">{tournament.startDate}</dd>
        </div>
        <div className="sm:col-span-1">
          <dt className="text-sm font-medium text-textSecondary">Fecha de Fin</dt>
          <dd className="mt-1 text-lg text-textPrimary">{tournament.endDate}</dd>
        </div>
         <div className="sm:col-span-1">
          <dt className="text-sm font-medium text-textSecondary">Número de Equipos</dt>
          <dd className="mt-1 text-lg text-textPrimary">{tournament.teams.length}</dd>
        </div>
        <div className="sm:col-span-1">
          <dt className="text-sm font-medium text-textSecondary">Número de Partidos</dt>
          <dd className="mt-1 text-lg text-textPrimary">{tournament.matches.length}</dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-sm font-medium text-textSecondary">Precio de Inscripción</dt>
          <dd className="mt-1 text-lg text-textPrimary">
            {tournament.inscriptionFee > 0 ? `${tournament.inscriptionFee.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}` : 'Gratis / No especificado'}
          </dd>
        </div>
      </dl>
    </Card>
  );
};

export default TournamentInfo;