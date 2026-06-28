import { useMemo } from 'react';
import type { StreamItem } from '../types/types';
import { processAnalytics } from '../utils/analyticsProcessor';
import type { AnalyticsAggregation } from '../utils/analyticsProcessor';

export const useAnalyticsAggregation = (data: StreamItem[]): AnalyticsAggregation => {
  // We strictly memoize the aggregation to ensure it only computes once when the overlay mounts 
  // with the frozen data snapshot.
  const aggregatedData = useMemo(() => {
    return processAnalytics(data);
  }, [data]); // data is the frozen snapshot passed when the overlay opens

  return aggregatedData;
};
