export const pagination = (page?: number, limit?: number) => {
  return {
    take: limit,
    skip: page && limit ? (page - 1) * limit : undefined,
  };
};
