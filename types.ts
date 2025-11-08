
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  enrollmentDate: string;
  stamps: number;
  rewardsRedeemed: number;
}

export interface Business {
  id: string;
  name: string;
  email: string;
  slug: string;
  plan?: 'Gratis' | 'Entrepreneur' | 'Pro';
  customerCount: number;
  cardSettings: any;
  surveySettings: any;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  imageUrl: string;
  content: string;
  excerpt: string;
  status: 'draft' | 'published';
  authorId?: string;
  createdAt: any;
  updatedAt?: any;
}
