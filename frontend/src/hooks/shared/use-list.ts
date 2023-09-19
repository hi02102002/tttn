import { useState } from 'react';

/**
 *
 * @param init
 * @returns {Array} [list, {push, insertAt, removeAt, updateAt, clear, set}]
 * @description A hook for managing a list of items
 */

export const useList = <T = unknown>(init: Array<T>) => {
   const [list, setList] = useState(init);

   /**
    *
    * @param {T} value
    * @returns {void}
    * @description Pushes a value to the end of the list
    */
   const push = (value: T): void => {
      setList((prev) => {
         return prev.concat(value);
      });
   };

   /**
    * @param {number} index
    * @returns {void}
    * @description Removes an element at a given index
    */
   const removeAt = (index: number): void => {
      setList((prev) => {
         return prev.splice(index, 1);
      });
   };

   /**
    * @param {number} index
    * @param {T} el
    * @returns {void}
    * @description Inserts an element at a given index
    */
   const insertAt = (index: number, el: T): void => {
      setList((prev) => {
         return prev.splice(index, 0, el);
      });
   };

   /**
    * @param {number} index
    * @param {T} el
    * @returns {void}
    * @description Updates an element at a given index
    */
   const updateAt = (index: number, el: T): void => {
      setList((prev) => {
         return prev.splice(index, 1, el);
      });
   };

   /**
    * @returns {void}
    * @description Clears the list
    */
   const clear = (): void => {
      return setList([]);
   };

   /**
    * @param {T[]} values
    * @returns {void}
    * @description Sets the list to a given array
    * */
   const set = (values: T[]): void => {
      setList(values);
   };

   return [
      list,
      {
         push,
         insertAt,
         removeAt,
         updateAt,
         clear,
         set,
      },
   ] as const;
};
