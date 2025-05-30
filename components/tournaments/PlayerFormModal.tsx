import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { Player, NewPlayerData, PlayerStatus } from '../../types';

interface PlayerFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: NewPlayerData) => void;
  initialData?: Player | null;
}

const PlayerFormModal: React.FC<PlayerFormModalProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState<PlayerStatus>(PlayerStatus.ACTIVE);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setRole(initialData.role);
      setStatus(initialData.status);
    } else {
      setName('');
      setRole('');
      setStatus(PlayerStatus.ACTIVE);
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(!name.trim() || !role.trim()){
        alert("El nombre y el rol del jugador no pueden estar vacíos.");
        return;
    }
    onSubmit({ name, role, status });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? 'Editar Jugador' : 'Añadir Nuevo Jugador'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nombre del Jugador"
          id="playerName"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Input
          label="Rol (ej: Capitán, Delantero)"
          id="playerRole"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
        />
        <div>
          <label htmlFor="playerStatus" className="block text-sm font-medium text-textSecondary mb-1">Estado</label>
          <select
            id="playerStatus"
            name="playerStatus"
            value={status}
            onChange={(e) => setStatus(e.target.value as PlayerStatus)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
          >
            {Object.values(PlayerStatus).map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div className="flex justify-end space-x-3 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="primary">{initialData ? 'Guardar Cambios' : 'Añadir Jugador'}</Button>
        </div>
      </form>
    </Modal>
  );
};

export default PlayerFormModal;