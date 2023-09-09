export const useDownload = () => {
   const a = document.createElement('a');
   document.body.appendChild(a);
   a.setAttribute('style', 'display: none');
   return function (data: Blob, fileName: string) {
      const url = window.URL.createObjectURL(data);
      a.href = url;
      a.download = fileName;
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
   };
};
