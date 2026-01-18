import { Controller, Get, Post, Patch, Delete, Param, Body, Query, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { PlayerService } from './player.service';
import { Player } from '../interfaces/player.interface';

@Controller('players')
export class PlayerController {
  private readonly logger = new Logger(PlayerController.name);

  constructor(private readonly playerService: PlayerService) {}

  @Post()
  @ApiBody({ type: Player })
  async createPlayer(@Body() player: Player): Promise<Player> {
    try {
      this.logger.log('POST /players');
      const createdPlayer = await this.playerService.create(player);
      this.logger.log(`Player created with ID: ${createdPlayer._id}`);
      return createdPlayer;
    } catch (error) {
      this.logger. error('Error creating player:', error. stack);
      throw new HttpException('Failed to create player', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Player> {
    try {
      this.logger.log(`GET /players/${id}`);
      return await this.playerService.findOne(id);
    } catch (error) {
      this.logger.error(`Error fetching player with id ${id}:`, error.stack);
      throw new HttpException('Player not found', HttpStatus.NOT_FOUND);
    }
  }

  @Get()
  async findAll(@Query('season') season?: string): Promise<Player[]> {
    try {
      this.logger.log(`GET /players${season ? `?season=${season}` : ''}`);
      return await this.playerService.findAll(season);
    } catch (error) {
      this.logger.error('Error fetching players:', error.stack);
      throw new HttpException('Failed to fetch players', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch(':id')
  @ApiBody({ type: Player })
  async update(@Param('id') id: string, @Body() updateData: Partial<Player>): Promise<Player> {
    try {
      this.logger.log(`PATCH /players/${id}`);
      return await this.playerService.update(id, updateData);
    } catch (error) {
      this.logger.error(`Error updating player with id ${id}:`, error.stack);
      throw new HttpException('Failed to update player', HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<Player> {
    try {
      this.logger.log(`DELETE /players/${id}`);
      return await this.playerService.delete(id);
    } catch (error) {
      this.logger.error(`Error deleting player with id ${id}:`, error.stack);
      throw new HttpException('Failed to delete player', HttpStatus.BAD_REQUEST);
    }
  }
}