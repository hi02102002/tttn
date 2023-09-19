import { ENDPOINTS } from '@/constants';
import { httpClient } from '@/lib/axios';
import { TQueryScore, TScore, TUpdateScoreDto } from '@/types/score';
import { TBaseResponse, TBaseService } from '@/types/shared';

class ScoreService implements TBaseService {
   endpoint: string = ENDPOINTS.SCORES;
   getAllScores(q?: TQueryScore): Promise<
      TBaseResponse<{
         total: number;
         scores: TScore[];
      }>
   > {
      return httpClient.get(this.endpoint, { params: q });
   }

   updateScoreStudent(data: TUpdateScoreDto): Promise<TBaseResponse<TScore>> {
      return httpClient.patch(this.endpoint, data);
   }
}

export const scoreService = new ScoreService();
