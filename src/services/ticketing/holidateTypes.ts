export type HolidateApiItem = {
  holidate: string;
};

export type HolidateApiResponse = {
  result: boolean;
  code: number;
  message: string;
  data: HolidateApiItem[];
};
