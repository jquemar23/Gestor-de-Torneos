import { useContext } from 'react';
import { TournamentContext } from '../contexts/TournamentContext';

export const useTournaments = () => {
  const context = useContext(TournamentContext);
  if (context === undefined) {
    throw new Error('useTournaments debe ser usado dentro de un TournamentProvider');
  }
  return context;
};