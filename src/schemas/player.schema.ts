import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'players' })
export class Player extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  number: number;

  @Prop({ required: true })
  position_specific: string;

  @Prop({ required: true })
  position_extended: string;

  @Prop({ required: true })
  url_image: string;

  @Prop({ required: true })
  season: string;

  @Prop({ required: false })
  stats_image: string;

  @Prop({ type: Object, required: false })
  stats: {
    matches_played?:  number;
    goals?: number;
    assists?: number;
    yellow_cards?: number;
    red_cards?: number;
    minutes_played?: number;
  };

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const PlayerSchema = SchemaFactory.createForClass(Player);