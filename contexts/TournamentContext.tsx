import React, { createContext, useState, ReactNode, useEffect, useContext } from 'react';
import { Tournament, Team, Player, TournamentStatus, PlayerStatus, NewTournamentData, NewTeamData, NewPlayerData, Match, MatchStatus, PaymentStatusType } from '../types';
import { AuthContext } from './AuthContext';
import { api } from '../api';

interface TournamentContextType {
  tournaments: Tournament[];
  getTournamentById: (id: string) => Tournament | undefined;
  addTournament: (tournamentData: NewTournamentData) => Tournament;
  updateTournament: (id: string, updates: Partial<Tournament>) => void;
  deleteTournament: (id: string) => void;
  addTeamToTournament: (tournamentId: string, teamData: NewTeamData) => Team | undefined;
  updateTeamInTournament: (tournamentId: string, teamId: string, updates: Partial<Team>) => void;
  removeTeamFromTournament: (tournamentId: string, teamId: string) => void;
  addPlayerToTeam: (tournamentId: string, teamId: string, playerData: NewPlayerData) => Player | undefined;
  updatePlayerInTeam: (tournamentId: string, teamId: string, playerId: string, updates: Partial<Player>) => void;
  removePlayerFromTeam: (tournamentId: string, teamId: string, playerId: string) => void;
  addMatchToTournament: (tournamentId: string, matchData: Omit<Match, 'id' | 'tournamentId' | 'teamAName' | 'teamBName'>) => Match | undefined;
  updateMatchInTournament: (tournamentId: string, matchId: string, updates: Partial<Match>) => void;
  updateTeamPaymentStatus: (tournamentId: string, teamId: string, status: PaymentStatusType) => void;
  isLoading: boolean;
}

export const TournamentContext = createContext<TournamentContextType | undefined>(undefined);

const normalizeTournament = (tournament: any): Tournament => ({
  ...tournament,
  teams: Array.isArray(tournament.teams) ? tournament.teams : [],
  matches: Array.isArray(tournament.matches) ? tournament.matches : [],
  inscriptionFee: Number(tournament.inscriptionFee ?? 0),
  status: tournament.status ?? TournamentStatus.SCHEDULED,
});

interface TournamentProviderProps {
  children: ReactNode;
}

export const TournamentProvider: React.FC<TournamentProviderProps> = ({ children }) => {
  const authContext = useContext(AuthContext);
  const userEmail = authContext?.userEmail;

  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!userEmail) {
      setTournaments([]);
      setIsLoading(false);
      return;
    }

    let ignore = false;

    const loadTournaments = async () => {
      setIsLoading(true);
      try {
        const response = await api.tournaments.getAll();
        if (!ignore) {
          setTournaments(response.tournaments.map(normalizeTournament));
        }
      } catch (error) {
        console.error('Error cargando torneos desde la API', error);
        if (!ignore) {
          setTournaments([]);
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    void loadTournaments();

    return () => {
      ignore = true;
    };
  }, [userEmail]);

  const getTournamentById = (id: string) => tournaments.find(t => t.id === id);

  const addTournament = (tournamentData: NewTournamentData) => {
    const newTournament: Tournament = {
      ...tournamentData,
      id: `tourn-${Date.now()}`,
      teams: [],
      matches: [],
      inscriptionFee: tournamentData.inscriptionFee || 0,
    };

    setTournaments(prev => [...prev, newTournament]);
    void api.tournaments.create({
      ...newTournament,
      teams: [],
      matches: [],
    }).catch((error) => {
      console.error('No se pudo guardar el torneo en la API', error);
    });

    return newTournament;
  };

  const updateTournament = (id: string, updates: Partial<Tournament>) => {
    setTournaments(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
    const current = tournaments.find(t => t.id === id);
    const payload = current ? { ...current, ...updates } : updates;

    void api.tournaments.update(id, payload).catch((error) => {
      console.error('No se pudo actualizar el torneo', error);
    });
  };

  const deleteTournament = (id: string) => {
    setTournaments(prev => prev.filter(t => t.id !== id));
    void api.tournaments.remove(id).catch((error) => {
      console.error('No se pudo eliminar el torneo', error);
    });
  };

  const addTeamToTournament = (tournamentId: string, teamData: NewTeamData) => {
    const newTeam: Team = {
      ...teamData,
      id: `team-${Date.now()}`,
      roster: [],
      matchesPlayed: 0,
      wins: 0,
      losses: 0,
      draws: 0,
      paymentStatus: 'Pendiente',
    };

    let addedTeam: Team | undefined = undefined;
    setTournaments(prev => prev.map(t => {
      if (t.id === tournamentId) {
        addedTeam = newTeam;
        return { ...t, teams: [...t.teams, newTeam] };
      }
      return t;
    }));

    const tournament = tournaments.find(t => t.id === tournamentId);
    if (tournament) {
      void api.tournaments.update(tournamentId, { ...tournament, teams: [...tournament.teams, newTeam] }).catch((error) => {
        console.error('No se pudo guardar el equipo', error);
      });
    }

    return addedTeam;
  };

  const updateTeamInTournament = (tournamentId: string, teamId: string, updates: Partial<Team>) => {
    setTournaments(prev => prev.map(t => {
      if (t.id === tournamentId) {
        return { ...t, teams: t.teams.map(team => team.id === teamId ? { ...team, ...updates } : team) };
      }
      return t;
    }));

    const tournament = tournaments.find(t => t.id === tournamentId);
    if (tournament) {
      const updatedTeams = tournament.teams.map(team => team.id === teamId ? { ...team, ...updates } : team);
      void api.tournaments.update(tournamentId, { ...tournament, teams: updatedTeams }).catch((error) => {
        console.error('No se pudo actualizar el equipo', error);
      });
    }
  };

  const updateTeamPaymentStatus = (tournamentId: string, teamId: string, status: PaymentStatusType) => {
    const tournament = tournaments.find(t => t.id === tournamentId);
    if (!tournament) return;

    const updatedTeams = tournament.teams.map(team => team.id === teamId ? { ...team, paymentStatus: status } : team);
    setTournaments(prev => prev.map(t => t.id === tournamentId ? { ...t, teams: updatedTeams } : t));

    void api.tournaments.update(tournamentId, { ...tournament, teams: updatedTeams }).catch((error) => {
      console.error('No se pudo actualizar el pago del equipo', error);
    });
  };

  const removeTeamFromTournament = (tournamentId: string, teamId: string) => {
    const tournament = tournaments.find(t => t.id === tournamentId);
    if (!tournament) return;

    const updatedTeams = tournament.teams.filter(team => team.id !== teamId);
    setTournaments(prev => prev.map(t => t.id === tournamentId ? { ...t, teams: updatedTeams } : t));

    void api.tournaments.update(tournamentId, { ...tournament, teams: updatedTeams }).catch((error) => {
      console.error('No se pudo eliminar el equipo', error);
    });
  };

  const addPlayerToTeam = (tournamentId: string, teamId: string, playerData: NewPlayerData) => {
    const tournament = tournaments.find(t => t.id === tournamentId);
    if (!tournament) return undefined;

    const newPlayer: Player = { ...playerData, id: `player-${Date.now()}` };
    const updatedTeams = tournament.teams.map(team => {
      if (team.id === teamId) {
        return { ...team, roster: [...team.roster, newPlayer] };
      }
      return team;
    });

    setTournaments(prev => prev.map(t => t.id === tournamentId ? { ...t, teams: updatedTeams } : t));
    void api.tournaments.update(tournamentId, { ...tournament, teams: updatedTeams }).catch((error) => {
      console.error('No se pudo guardar el jugador', error);
    });

    return newPlayer;
  };

  const updatePlayerInTeam = (tournamentId: string, teamId: string, playerId: string, updates: Partial<Player>) => {
    const tournament = tournaments.find(t => t.id === tournamentId);
    if (!tournament) return;

    const updatedTeams = tournament.teams.map(team => {
      if (team.id === teamId) {
        return { ...team, roster: team.roster.map(p => p.id === playerId ? { ...p, ...updates } : p) };
      }
      return team;
    });

    setTournaments(prev => prev.map(t => t.id === tournamentId ? { ...t, teams: updatedTeams } : t));
    void api.tournaments.update(tournamentId, { ...tournament, teams: updatedTeams }).catch((error) => {
      console.error('No se pudo actualizar el jugador', error);
    });
  };

  const removePlayerFromTeam = (tournamentId: string, teamId: string, playerId: string) => {
    const tournament = tournaments.find(t => t.id === tournamentId);
    if (!tournament) return;

    const updatedTeams = tournament.teams.map(team => {
      if (team.id === teamId) {
        return { ...team, roster: team.roster.filter(p => p.id !== playerId) };
      }
      return team;
    });

    setTournaments(prev => prev.map(t => t.id === tournamentId ? { ...t, teams: updatedTeams } : t));
    void api.tournaments.update(tournamentId, { ...tournament, teams: updatedTeams }).catch((error) => {
      console.error('No se pudo borrar el jugador', error);
    });
  };

  const addMatchToTournament = (tournamentId: string, matchData: Omit<Match, 'id' | 'tournamentId' | 'teamAName' | 'teamBName'>) => {
    const tournament = tournaments.find(t => t.id === tournamentId);
    if (!tournament) return undefined;

    const teamA = tournament.teams.find(team => team.id === matchData.teamAId);
    const teamB = tournament.teams.find(team => team.id === matchData.teamBId);
    const newMatch: Match = {
      ...matchData,
      id: `match-${Date.now()}`,
      tournamentId,
      teamAName: teamA?.name,
      teamBName: teamB?.name,
    };

    const updatedMatches = [...tournament.matches, newMatch];
    setTournaments(prev => prev.map(t => t.id === tournamentId ? { ...t, matches: updatedMatches } : t));
    void api.tournaments.update(tournamentId, { ...tournament, matches: updatedMatches }).catch((error) => {
      console.error('No se pudo guardar el partido', error);
    });

    return newMatch;
  };

  const updateMatchInTournament = (tournamentId: string, matchId: string, updates: Partial<Match>) => {
    const tournament = tournaments.find(t => t.id === tournamentId);
    if (!tournament) return;

    const updatedMatches = tournament.matches.map(m => m.id === matchId ? { ...m, ...updates } : m);
    setTournaments(prev => prev.map(t => t.id === tournamentId ? { ...t, matches: updatedMatches } : t));
    void api.tournaments.update(tournamentId, { ...tournament, matches: updatedMatches }).catch((error) => {
      console.error('No se pudo actualizar el partido', error);
    });
  };

  return (
    <TournamentContext.Provider value={{
      tournaments,
      getTournamentById,
      addTournament,
      updateTournament,
      deleteTournament,
      addTeamToTournament,
      updateTeamInTournament,
      removeTeamFromTournament,
      addPlayerToTeam,
      updatePlayerInTeam,
      removePlayerFromTeam,
      addMatchToTournament,
      updateMatchInTournament,
      updateTeamPaymentStatus,
      isLoading,
    }}>
      {children}
    </TournamentContext.Provider>
  );
};