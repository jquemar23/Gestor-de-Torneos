import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { Team, NewTeamData } from '../../types';

interface TeamFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: NewTeamData) => void;
  initialData?: Team | null; // For editing
}

const TeamFormModal: React.FC<TeamFormModalProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [name, setName] = useState('');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
    } else {
      setName('');
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
        alert("El nombre del equipo no puede estar vacío."); // Basic validation
        return;
    }
    onSubmit({ name });
    onClose(); 
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? 'Editar Equipo' : 'Añadir Nuevo Equipo'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nombre del Equipo"
          id="teamName"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="Introduce el nombre del equipo"
        />
        <div className="flex justify-end space-x-3 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="primary">{initialData ? 'Guardar Cambios' : 'Añadir Equipo'}</Button>
        </div>
      </form>
    </Modal>
  );
};

export default TeamFormModal;