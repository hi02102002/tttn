export const calcPageCount = (total: number, limit: number) => {
   return Math.ceil(total / limit);
};

export const seedYears = (startYear = 1990, endYear = 2050) => {
   const years = [];

   while (startYear <= endYear) {
      years.push(startYear++);
   }

   return years;
};

export const getFullYear = (date: Date) => {
   return date.getFullYear();
};

export const toIds = (obj: Record<string, boolean>) => {
   return Object.keys(obj).filter((key) => obj[key]);
};
