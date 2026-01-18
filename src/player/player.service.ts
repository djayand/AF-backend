import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Player } from '../interfaces/player.interface';

@Injectable()
export class PlayerService {
  constructor(@InjectModel('Player') private readonly playerModel: Model<Player>) {}

  /**
   * Creates a new player in the database. 
   * @param player - The player data to save.
   * @returns The saved player.
   */
  async create(player: Player): Promise<Player> {
    try {
      const newPlayer = new this.playerModel(player);
      return await newPlayer.save();
    } catch (error) {
      throw new HttpException('Failed to create player', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Finds a player by its ID.
   * @param id - The ID of the player to find.
   * @returns The found player.
   */
  async findOne(id: string): Promise<Player> {
    try {
      const player = await this.playerModel.findById(id).exec();
      if (!player) {
        throw new HttpException(`Player with id ${id} not found`, HttpStatus.NOT_FOUND);
      }
      return player;
    } catch (error) {
      throw new HttpException(`Failed to fetch player with id ${id}`, HttpStatus.NOT_FOUND);
    }
  }

  /**
   * Retrieves all players from the database. 
   * Optionally filters by season.
   * @param season - Optional season filter (e.g., "2024-2025")
   * @returns A list of all players.
   */
  async findAll(season?: string): Promise<Player[]> {
    try {
      const filter = season ? { season } : {};
      return await this.playerModel.find(filter).exec();
    } catch (error) {
      throw new HttpException('Failed to fetch players', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Updates a player by its ID. 
   * @param id - The ID of the player to update. 
   * @param updateData - The data to update the player with. 
   * @returns The updated player. 
   */
  async update(id: string, updateData:  Partial<Player>): Promise<Player> {
    try {
      const updatedPlayer = await this. playerModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
      if (!updatedPlayer) {
        throw new HttpException(`Player with id ${id} not found`, HttpStatus.NOT_FOUND);
      }
      return updatedPlayer;
    } catch (error) {
      throw new HttpException(`Failed to update player with id ${id}`, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Deletes a player by its ID.
   * @param id - The ID of the player to delete.
   * @returns The deleted player.
   */
  async delete(id:  string): Promise<Player> {
    try {
      const deletedPlayer = await this.playerModel. findByIdAndDelete(id).exec();
      if (!deletedPlayer) {
        throw new HttpException(`Player with id ${id} not found`, HttpStatus.NOT_FOUND);
      }
      return deletedPlayer;
    } catch (error) {
      throw new HttpException(`Failed to delete player with id ${id}`, HttpStatus.BAD_REQUEST);
    }
  }
}