import { Document } from 'mongoose';
import { PlayerStats } from './player-stats.interface';

export class Player extends Document {
  id: string;
  name: string;
  number: number;
  position_specific: string;
  position_extended: string;
  url_image: string;
  season: string;
  stats_image: string;
  stats: PlayerStats;
  createdAt: Date;
  updatedAt: Date;
}