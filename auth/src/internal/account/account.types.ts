export type VerificationParams = {
  login: string;
  password: string;
};

export type GetUsersByFiltersParam = {
  login?: string;
  userIds?: string[];
  phones?: string[];
  take?: number;
  skip?: number;
};

export type UserItem = {
  userId: string;
  login: string;
  phone: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  email?: string;
};

export type GetUsersResponse = {
  items: UserItem[];
  total: number;
};