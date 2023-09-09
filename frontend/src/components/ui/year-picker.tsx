import { cn } from '@/lib/utils';
import { seedYears } from '@/utils';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import { addYears, subYears } from 'date-fns';
import { createContext, forwardRef, useContext, useState } from 'react';
import { Button, ButtonProps } from '.';

const DISTANCE = 11;

const MIN_YEAR = 1900;
const MAX_YEAR = 2060;

type TYearPickerContext = {
   handleNextFromTo: () => void;
   handlePrevFromTo: () => void;
   fromTo: {
      from: Date;
      to: Date;
   };
   handleChange: (value: Date) => void;
   value?: Date;
};

const YearPickerContext = createContext<TYearPickerContext>({
   handleNextFromTo: () => {},
   handlePrevFromTo: () => {},
   fromTo: {
      from: new Date(),
      to: new Date(),
   },
   handleChange: () => {},
});

const useYearPickerContext = () => {
   const context = useContext(YearPickerContext);

   if (context === undefined) {
      throw new Error(
         'useYearPickerContext must be used within a YearPickerProvider'
      );
   }

   return context;
};

const Header = () => {
   const {
      handleNextFromTo,
      handlePrevFromTo,
      fromTo: { from, to },
   } = useYearPickerContext();

   return (
      <div className="flex justify-between items-center">
         <Button
            onClick={handlePrevFromTo}
            variant="outline"
            className="p-0 w-7 h-7 flex items-center justify-center"
            disabled={from.getFullYear() <= MIN_YEAR}
         >
            <IconChevronLeft className="h-4 w-4" />
         </Button>
         <span className="font-medium">{`${from.getFullYear()} - ${to.getFullYear()}`}</span>
         <Button
            onClick={handleNextFromTo}
            variant="outline"
            className="p-0 w-7 h-7 flex items-center justify-center"
            disabled={from.getFullYear() >= MAX_YEAR}
         >
            <IconChevronRight className="h-4 w-4" />
         </Button>
      </div>
   );
};

type YearItemProps = {
   year: Date;
} & ButtonProps;

const YearItem = forwardRef<HTMLButtonElement, YearItemProps>(
   ({ year, className, onClick, ...rest }, ref) => {
      const { handleChange, value } = useYearPickerContext();
      const isCurrentYear = year.getFullYear() === new Date().getFullYear();
      const isActive = year.getFullYear() === value?.getFullYear();

      return (
         <Button
            {...rest}
            ref={ref}
            className={cn(
               {
                  'bg-accent': isCurrentYear && !isActive,
               },
               className
            )}
            variant={isActive ? 'default' : 'ghost'}
            onClick={(e) => {
               const currentDate = new Date();
               handleChange(
                  new Date(
                     year.getFullYear(),
                     currentDate.getMonth(),
                     currentDate.getDate()
                  )
               );
               onClick && onClick(e);
            }}
         >
            {year.getFullYear()}
         </Button>
      );
   }
);

const ListYear = () => {
   const { fromTo } = useYearPickerContext();

   const years = seedYears(fromTo.from.getFullYear(), fromTo.to.getFullYear());

   return (
      <ul className="grid grid-cols-3">
         {years.map((year) => {
            const _year = new Date(year, 0, 1);

            return (
               <li key={year}>
                  <YearItem year={_year} />
               </li>
            );
         })}
      </ul>
   );
};

YearItem.displayName = 'YearItem';

const YearPicker = ({
   value: initValue,
   onChange,
}: {
   value?: Date;
   onChange?: (value: Date) => void;
}) => {
   const [currentYear, setCurrentYear] = useState<Date>(
      initValue || new Date()
   );
   const isControlled = initValue !== undefined && onChange !== undefined;
   const [fromTo, setFromTo] = useState<{
      from: Date;
      to: Date;
   }>({
      from: subYears(currentYear, DISTANCE),
      to: currentYear,
   });

   const _value = initValue || currentYear;

   const handleChange = (value: Date) => {
      if (isControlled) {
         onChange && onChange(value);
      } else {
         setCurrentYear(value);
      }
   };

   const handlePrev = () => {
      const newFrom = subYears(fromTo.from, DISTANCE);
      const newTo = subYears(fromTo.to, DISTANCE);

      if (newFrom.getFullYear() >= MIN_YEAR) {
         setFromTo({
            from: newFrom,
            to: newTo,
         });
      }
   };

   const handleNext = () => {
      const newFrom = addYears(fromTo.from, DISTANCE);
      const newTo = addYears(fromTo.to, DISTANCE);

      if (newTo.getFullYear() <= MAX_YEAR) {
         setFromTo({
            from: newFrom,
            to: newTo,
         });
      }
   };

   return (
      <YearPickerContext.Provider
         value={{
            handleNextFromTo: handleNext,
            handlePrevFromTo: handlePrev,
            fromTo,
            handleChange,
            value: _value,
         }}
      >
         <div className="p-3">
            <div className="flex flex-col gap-4">
               <Header />
               <ListYear />
            </div>
         </div>
      </YearPickerContext.Provider>
   );
};

export default YearPicker;
