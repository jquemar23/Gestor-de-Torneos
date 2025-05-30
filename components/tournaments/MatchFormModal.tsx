import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { Match, Team, Tournament, MatchStatus } from '../../types';

interface MatchFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Match, 'id' | 'tournamentId' | 'teamAName' | 'teamBName' | 'status'>, isResultUpdate: boolean) => void;
  tournament: Tournament;
  initialData?: Match | null; // For editing or inputting results
}

const MatchFormModal: React.FC<MatchFormModalProps> = ({ isOpen, onClose, onSubmit, tournament, initialData }) => {
  const [teamAId, setTeamAId] = useState<string>('');
  const [teamBId, setTeamBId] = useState<string>('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [scoreA, setScoreA] = useState<string>('');
  const [scoreB, setScoreB] = useState<string>('');

  const availableTeams = tournament.teams;
  const isEditing = !!initialData;
  const isResultInputMode = isEditing && initialData?.status === MatchStatus.SCHEDULED;

  useEffect(() => {
    if (initialData) {
      setTeamAId(initialData.teamAId);
      setTeamBId(initialData.teamBId);
      setDate(initialData.date);
      setTime(initialData.time);
      setScoreA(initialData.scoreA !== null ? String(initialData.scoreA) : '');
      setScoreB(initialData.scoreB !== null ? String(initialData.scoreB) : '');
    } else {
      setTeamAId(availableTeams.length > 0 ? availableTeams[0].id : '');
      setTeamBId(availableTeams.length > 1 ? availableTeams[1].id : '');
      setDate(new Date().toISOString().split('T')[0]);
      setTime('12:00');
      setScoreA('');
      setScoreB('');
    }
  }, [initialData, isOpen, availableTeams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamAId || !teamBId || teamAId === teamBId) {
      alert("Por favor, selecciona dos equipos diferentes.");
      return;
    }
    
    const finalScoreA = scoreA === '' ? null : parseInt(scoreA, 10);
    const finalScoreB = scoreB === '' ? null : parseInt(scoreB, 10);

    if ((finalScoreA !== null && isNaN(finalScoreA)) || (finalScoreB !== null && isNaN(finalScoreB))) {
        alert("Los marcadores deben ser números o estar vacíos.");
        return;
    }
    
    onSubmit({ 
        teamAId, 
        teamBId, 
        date, 
        time, 
        scoreA: finalScoreA, 
        scoreB: finalScoreB 
    }, isResultInputMode || (finalScoreA !== null && finalScoreB !== null));
    onClose();
  };
  
  const filteredTeamBOptions = availableTeams.filter(t => t.id !== teamAId);
  
  const getModalTitle = () => {
    if (isEditing) {
      return isResultInputMode ? 'Ingresar Resultado del Partido' : 'Editar Partido';
    }
    return 'Programar Nuevo Partido';
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={getModalTitle()}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="teamAId" className="block text-sm font-medium text-textSecondary mb-1">Equipo A</label>
            <select
              id="teamAId"
              value={teamAId}
              onChange={(e) => setTeamAId(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
              disabled={isEditing && !isResultInputMode}
            >
              {availableTeams.map(team => <option key={team.id} value={team.id}>{team.name}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="teamBId" className="block text-sm font-medium text-textSecondary mb-1">Equipo B</label>
            <select
              id="teamBId"
              value={teamBId}
              onChange={(e) => setTeamBId(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
              disabled={isEditing && !isResultInputMode}
            >
              {filteredTeamBOptions.map(team => <option key={team.id} value={team.id}>{team.name}</option>)}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Fecha"
            id="matchDate"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            disabled={isEditing && !isResultInputMode}
          />
          <Input
            label="Hora"
            id="matchTime"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
            disabled={isEditing && !isResultInputMode}
          />
        </div>
        {(isEditing || isResultInputMode) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Marcador Equipo A"
              id="scoreA"
              type="number"
              min="0"
              value={scoreA}
              onChange={(e) => setScoreA(e.target.value)}
              placeholder="-"
            />
            <Input
              label="Marcador Equipo B"
              id="scoreB"
              type="number"
              min="0"
              value={scoreB}
              onChange={(e) => setScoreB(e.target.value)}
              placeholder="-"
            />
          </div>
        )}
        <div className="flex justify-end space-x-3 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="primary">
            {isEditing ? (isResultInputMode ? 'Guardar Resultado' : 'Guardar Cambios') : 'Programar Partido'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default MatchFormModal;