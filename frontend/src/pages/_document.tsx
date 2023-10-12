import Document, { Head, Html, Main, NextScript } from 'next/document';

class MyDocument extends Document {
   static async getInitialProps(context: any) {
      const initialProps = await Document.getInitialProps(context);
      return { ...initialProps };
   }

   render() {
      return (
         <Html lang="en">
            <Head />
            <body>
               <Main />
               <NextScript />
            </body>
         </Html>
      );
   }
}

export default MyDocument;
