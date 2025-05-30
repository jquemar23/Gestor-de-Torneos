import React, { createContext, useState, ReactNode, useEffect, useContext } from 'react';
import { Tournament, Team, Player, TournamentStatus, PlayerStatus, NewTournamentData, NewTeamData, NewPlayerData, Match, MatchStatus, PaymentStatusType } from '../types';
import { AuthContext } from './AuthContext'; // Import AuthContext

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
  updateTeamPaymentStatus: (tournamentId: string, teamId: string, status: PaymentStatusType) => void; // Added
  isLoading: boolean; 
}

export const TournamentContext = createContext<TournamentContextType | undefined>(undefined);

// Initial mock data - this will be loaded for new users or users without existing data
const initialTournaments: Tournament[] = [
  {
    id: 'tourn-1-default',
    name: 'Campeonato Regional de Fútbol (Ejemplo)',
    status: TournamentStatus.ACTIVE,
    startDate: '2024-08-01',
    endDate: '2024-08-15',
    inscriptionFee: 50, // Example fee
    teams: [
      { id: 'team-alpha-default', name: 'Equipo Alpha (Ejemplo)', roster: [{id: 'p1-default', name: 'Juan Pérez', role: 'Capitán', status: PlayerStatus.ACTIVE}], matchesPlayed: 1, wins: 1, losses: 0, draws: 0, paymentStatus: 'Pagado' },
      { id: 'team-beta-default', name: 'Equipo Beta (Ejemplo)', roster: [{id: 'p2-default', name: 'Ana López', role: 'Delantera', status: PlayerStatus.ACTIVE}], matchesPlayed: 1, wins: 0, losses: 1, draws: 0, paymentStatus: 'Pendiente' },
    ],
    matches: [
        { id: 'match-1-default', tournamentId: 'tourn-1-default', teamAId: 'team-alpha-default', teamBId: 'team-beta-default', date: '2024-08-02', time: '14:00', scoreA: 2, scoreB: 1, status: MatchStatus.COMPLETED }
    ],
  },
  {
    id: 'tourn-2-default',
    name: 'Liga de Baloncesto Ciudad (Ejemplo)',
    status: TournamentStatus.SCHEDULED,
    startDate: '2024-09-01',
    endDate: '2024-09-30',
    inscriptionFee: 25, // Example fee
    teams: [],
    matches: [],
  },
];

interface TournamentProviderProps {
  children: ReactNode;
}

export const TournamentProvider: React.FC<TournamentProviderProps> = ({ children }) => {
  const authContext = useContext(AuthContext);
  const userEmail = authContext?.userEmail;
  
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true); 

  const getLocalStorageKey = (email: string | null | undefined) => {
    return email ? `tournaments_${email}` : null;
  }

  useEffect(() => {
    if (userEmail) {
      setIsLoading(true);
      const key = getLocalStorageKey(userEmail);
      if (key) {
        const savedTournaments = localStorage.getItem(key);
        try {
          if (savedTournaments) {
            setTournaments(JSON.parse(savedTournaments));
          } else {
            setTournaments(initialTournaments.map(t => ({...t, id: `${t.id}-${userEmail}-${Date.now()}`}))); 
          }
        } catch (error) {
          console.error("Error parsing user-specific tournaments from localStorage", error);
          setTournaments(initialTournaments.map(t => ({...t, id: `${t.id}-${userEmail}-${Date.now()}`}))); 
        }
      }
      setIsLoading(false);
    } else {
      setTournaments([]);
      setIsLoading(false);
    }
  }, [userEmail]);

  useEffect(() => {
    console.log("[TournamentContext] Save effect triggered. User:", userEmail, "IsLoading:", isLoading);
    if (userEmail && !isLoading) { 
      const key = getLocalStorageKey(userEmail);
      if (key) {
        console.log(`[TournamentContext] Saving ${tournaments.length} tournaments to localStorage for key: ${key}`);
        console.log("[TournamentContext] Tournaments being saved:", tournaments.map(t => t.id));
        try {
          localStorage.setItem(key, JSON.stringify(tournaments));
          console.log("[TournamentContext] Save to localStorage successful.");
        } catch (e) {
          console.error("[TournamentContext] Error saving tournaments to localStorage:", e);
        }
      } else {
        console.warn("[TournamentContext] Cannot save, localStorage key is null.");
      }
    } else {
      if (!userEmail) console.log("[TournamentContext] Not saving: userEmail is null.");
      if (isLoading) console.log("[TournamentContext] Not saving: isLoading is true.");
    }
  }, [tournaments, userEmail, isLoading]);

  const getTournamentById = (id: string) => tournaments.find(t => t.id === id);

  const addTournament = (tournamentData: NewTournamentData) => {
    const newTournament: Tournament = {
      ...tournamentData,
      id: `tourn-${Date.now()}`, 
      teams: [],
      matches: [],
      inscriptionFee: tournamentData.inscriptionFee || 0, // Ensure inscriptionFee is set
    };
    setTournaments(prev => [...prev, newTournament]);
    return newTournament;
  };
  
  const updateTournament = (id: string, updates: Partial<Tournament>) => {
    setTournaments(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const deleteTournament = (id: string) => {
    console.log("[TournamentContext] Attempting to delete tournament with ID:", id);
    setTournaments(prev => {
      console.log("[TournamentContext] Current tournaments before delete (IDs):", prev.map(t => t.id));
      const updatedTournaments = prev.filter(t => t.id !== id);
      console.log("[TournamentContext] Tournaments after delete attempt (IDs, local to setTournaments):", updatedTournaments.map(t => t.id));
      if (prev.length === updatedTournaments.length) {
          console.warn("[TournamentContext] Delete operation did not change tournament count. ID might not have matched correctly.");
          const foundTournament = prev.find(t => t.id === id);
          if (!foundTournament) {
              console.warn(`[TournamentContext] Tournament with ID '${id}' was NOT found in the current list of ${prev.length} tournaments.`);
          } else {
              console.warn(`[TournamentContext] Tournament with ID '${id}' WAS found, but filter 't.id !== id' did not remove it. This is unexpected. Check for subtle differences in ID strings (e.g., whitespace, case).`);
          }
      } else {
        console.log(`[TournamentContext] Successfully filtered. Old count: ${prev.length}, New count: ${updatedTournaments.length}`);
      }
      return updatedTournaments;
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
      paymentStatus: 'Pendiente', // Default payment status
    };
    let addedTeam: Team | undefined = undefined;
    setTournaments(prev => prev.map(t => {
      if (t.id === tournamentId) {
        addedTeam = newTeam;
        return { ...t, teams: [...t.teams, newTeam] };
      }
      return t;
    }));
    return addedTeam;
  };
  
  const updateTeamInTournament = (tournamentId: string, teamId: string, updates: Partial<Team>) => {
    setTournaments(prev => prev.map(t => {
      if (t.id === tournamentId) {
        return { ...t, teams: t.teams.map(team => team.id === teamId ? { ...team, ...updates } : team) };
      }
      return t;
    }));
  };

  const updateTeamPaymentStatus = (tournamentId: string, teamId: string, status: PaymentStatusType) => {
    setTournaments(prev => prev.map(t => {
      if (t.id === tournamentId) {
        return { 
          ...t, 
          teams: t.teams.map(team => 
            team.id === teamId ? { ...team, paymentStatus: status } : team
          ) 
        };
      }
      return t;
    }));
  };

  const removeTeamFromTournament = (tournamentId: string, teamId: string) => {
     setTournaments(prev => prev.map(t => {
      if (t.id === tournamentId) {
        return { ...t, teams: t.teams.filter(team => team.id !== teamId) };
      }
      return t;
    }));
  };

  const addPlayerToTeam = (tournamentId: string, teamId: string, playerData: NewPlayerData) => {
    const newPlayer: Player = { ...playerData, id: `player-${Date.now()}` };
    let addedPlayer: Player | undefined = undefined;
    setTournaments(prev => prev.map(t => {
      if (t.id === tournamentId) {
        return { 
          ...t, 
          teams: t.teams.map(team => {
            if (team.id === teamId) {
              addedPlayer = newPlayer;
              return { ...team, roster: [...team.roster, newPlayer] };
            }
            return team;
          }) 
        };
      }
      return t;
    }));
    return addedPlayer;
  };

  const updatePlayerInTeam = (tournamentId: string, teamId: string, playerId: string, updates: Partial<Player>) => {
     setTournaments(prev => prev.map(t => {
      if (t.id === tournamentId) {
        return { 
          ...t, 
          teams: t.teams.map(team => {
            if (team.id === teamId) {
              return { ...team, roster: team.roster.map(p => p.id === playerId ? {...p, ...updates} : p) };
            }
            return team;
          }) 
        };
      }
      return t;
    }));
  };
  
  const removePlayerFromTeam = (tournamentId: string, teamId: string, playerId: string) => {
    setTournaments(prev => prev.map(t => {
      if (t.id === tournamentId) {
        return { 
          ...t, 
          teams: t.teams.map(team => {
            if (team.id === teamId) {
              return { ...team, roster: team.roster.filter(p => p.id !== playerId) };
            }
            return team;
          }) 
        };
      }
      return t;
    }));
  };

  const addMatchToTournament = (tournamentId: string, matchData: Omit<Match, 'id' | 'tournamentId' | 'teamAName' | 'teamBName'>) => {
    let addedMatch: Match | undefined = undefined;
    setTournaments(prevTournaments =>
      prevTournaments.map(t => {
        if (t.id === tournamentId) {
          const teamA = t.teams.find(team => team.id === matchData.teamAId);
          const teamB = t.teams.find(team => team.id === matchData.teamBId);
          const newMatch: Match = {
            ...matchData,
            id: `match-${Date.now()}`,
            tournamentId,
            teamAName: teamA?.name,
            teamBName: teamB?.name,
          };
          addedMatch = newMatch;
          return { ...t, matches: [...t.matches, newMatch] };
        }
        return t;
      })
    );
    return addedMatch;
  };

  const updateMatchInTournament = (tournamentId: string, matchId: string, updates: Partial<Match>) => {
    setTournaments(prevTournaments =>
      prevTournaments.map(t => {
        if (t.id === tournamentId) {
          return {
            ...t,
            matches: t.matches.map(m => (m.id === matchId ? { ...m, ...updates } : m)),
          };
        }
        return t;
      })
    );
  };


  return (
    <TournamentContext.Provider value={{ 
      tournaments, getTournamentById, addTournament, updateTournament, deleteTournament, 
      addTeamToTournament, updateTeamInTournament, removeTeamFromTournament,
      addPlayerToTeam, updatePlayerInTeam, removePlayerFromTeam,
      addMatchToTournament, updateMatchInTournament,
      updateTeamPaymentStatus, // Added
      isLoading
    }}>
      {children}
    </TournamentContext.Provider>
  );
};