import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { Tournament, NewTournamentData, TournamentStatus } from '../../types';

interface TournamentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: NewTournamentData) => void;
  initialData?: Tournament | null;
}

const TournamentFormModal: React.FC<TournamentFormModalProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState<TournamentStatus>(TournamentStatus.SCHEDULED);
  const [inscriptionFee, setInscriptionFee] = useState<number>(0);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setStartDate(initialData.startDate);
      setEndDate(initialData.endDate);
      setStatus(initialData.status);
      setInscriptionFee(initialData.inscriptionFee || 0);
    } else {
      // Reset for new tournament
      setName('');
      setStartDate(new Date().toISOString().split('T')[0]);
      setEndDate('');
      setStatus(TournamentStatus.SCHEDULED);
      setInscriptionFee(0);
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, startDate, endDate, status, inscriptionFee: Number(inscriptionFee) });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? 'Editar Torneo' : 'Crear Nuevo Torneo'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nombre del Torneo"
          id="tournamentName"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Fecha de Inicio"
            id="startDate"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
          <Input
            label="Fecha de Fin"
            id="endDate"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
            min={startDate}
          />
        </div>
        <Input
          label="Precio de Inscripción (€)"
          id="inscriptionFee"
          type="number"
          value={inscriptionFee.toString()}
          onChange={(e) => setInscriptionFee(parseFloat(e.target.value) || 0)}
          min="0"
          step="0.01"
        />
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-textSecondary mb-1">Estado</label>
          <select
            id="status"
            name="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as TournamentStatus)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
          >
            {Object.values(TournamentStatus).map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div className="flex justify-end space-x-3 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="primary">{initialData ? 'Guardar Cambios' : 'Crear Torneo'}</Button>
        </div>
      </form>
    </Modal>
  );
};

export default TournamentFormModal;