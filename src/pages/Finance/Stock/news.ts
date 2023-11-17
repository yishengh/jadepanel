interface NewsItem {
  title: string;
  url: string;
  time_published: string;
  authors: string[];
  summary: string;
  banner_image: string;
  source: string;
  category_within_source: string;
  source_domain: string;
  topics: {
    topic: string;
    relevance_score: string;
  }[];
  overall_sentiment_score: number;
  overall_sentiment_label:
    | 'Bearish'
    | 'Somewhat-Bearish'
    | 'Neutral'
    | 'Somewhat_Bullish'
    | 'Bullish';
  ticker_sentiment: any[]; // You can specify a proper type for this if available
}

interface NewsApiResponse {
  items: string;
  sentiment_score_definition: string;
  relevance_score_definition: string;
  feed: NewsItem[];
}
