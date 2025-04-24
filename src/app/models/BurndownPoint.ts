export interface BurndownPoint {
  date: string;
  cumulativeTraites: number;
  totalObjectif: number;
  dailyTraites: number; 
  remainingWork: number // Added field for daily production
}