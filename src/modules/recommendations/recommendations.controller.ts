import { Controller, Post, Body, Param, Query } from '@nestjs/common';
import { RecommendationsService } from './recommendations.service';
import { UserRecommendationDto, PreferenceRecommendationDto } from '../../dto/recommendation-request.dto';

@Controller('recommendations')
export class RecommendationsController {
  constructor(private readonly recommendationsService: RecommendationsService) {}

  @Post('user/:userId')
  getUserRecommendations(
    @Param('userId') userId: string,
    @Body() dto: UserRecommendationDto,
  ) {
    return this.recommendationsService.getUserRecommendations(userId, dto.limit);
  }

  @Post('preference')
  getPreferenceRecommendations(@Body() dto: PreferenceRecommendationDto) {
    return this.recommendationsService.getPreferenceRecommendations(dto.preference, dto.limit);
  }

  @Post('hybrid/:userId')
  getHybridRecommendations(
    @Param('userId') userId: string,
    @Body() body: { preference?: string; limit?: number },
  ) {
    return this.recommendationsService.getHybridRecommendations(
      userId,
      body.preference,
      body.limit || 10,
    );
  }
}