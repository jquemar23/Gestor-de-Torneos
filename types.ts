export enum TournamentStatus {
  SCHEDULED = 'Programado',
  ACTIVE = 'Activo',
  COMPLETED = 'Completado',
}

export enum PlayerStatus {
  ACTIVE = 'Activo',
  INACTIVE = 'Inactivo',
}

export enum MatchStatus {
  SCHEDULED = 'Programado',
  COMPLETED = 'Completado',
}

export type PaymentStatusType = 'Pagado' | 'Pendiente';

export interface Player {
  id: string;
  name: string;
  role: string; // e.g., Capitán, Delantero, Portero
  status: PlayerStatus;
}

export interface Team {
  id: string;
  name: string;
  roster: Player[];
  matchesPlayed: number;
  wins: number;
  losses: number;
  draws: number;
  paymentStatus: PaymentStatusType; // Added for payment tracking
  // Points calculated: wins * 3 + draws * 1
}

export interface Match {
  id: string;
  tournamentId: string;
  teamAId: string;
  teamBId: string;
  teamAName?: string; // For display
  teamBName?: string; // For display
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  scoreA: number | null;
  scoreB: number | null;
  status: MatchStatus;
}

export interface Tournament {
  id: string;
  name: string;
  status: TournamentStatus;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  teams: Team[];
  matches: Match[];
  inscriptionFee: number; // Added for payment tracking
}

export type NewTournamentData = Omit<Tournament, 'id' | 'teams' | 'matches'>;
export type NewTeamData = Omit<Team, 'id' | 'roster' | 'matchesPlayed' | 'wins' | 'losses' | 'draws' | 'paymentStatus'>;
export type NewPlayerData = Omit<Player, 'id'>;