export interface Assets {
  assetsId: number;

  assetsName: string;
  assetsOwner: string;
  assetsLocation: string;
  totalPrice: string;
  historicalValue: string;

  assetsInstalment: string;
  instalmentPrice: string;
  instalmentSurplus: string;
  realizationValue: string;

  assetsRemark: string;
  assetsCreateTime: string;

  offset: string;
  limit: number;
}
export interface UserAssets {
  assetsId: number;

  assetsName: string;
  assetsOwner: string;
  assetsLocation: string;
  totalPrice: string;
  historicalValue: string;

  assetsInstalment: string;
  instalmentPrice: string;
  instalmentSurplus: string;
  realizationValue: string;

  assetsRemark: string;
  assetsCreateTime: string;

  offset: string;
  limit: number;
}
export type AssetsPagination = {
  limit: number;
  total: number;
  pageSize: number;
  current: number;
};
