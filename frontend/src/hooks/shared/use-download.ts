import { useIsClient } from './use-is-client';

export const useDownload = () => {
   const isClient = useIsClient();

   if (!isClient) {
      return () => null;
   }

   const a = document.createElement('a');
   document.body.appendChild(a);
   a.setAttribute('style', 'display: none');
   return async function (data: Blob, fileName: string) {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const url = window.URL.createObjectURL(data);
      a.href = url;
      a.download = fileName;
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
   };
};
