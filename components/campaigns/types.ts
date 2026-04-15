// components/campaigns/types.ts
export type Campaign = {
    id: string;
    title: string;
    image: string;
    raised: number;
    goal: number;
    progress: number; // 0-100
    category: string;
  };