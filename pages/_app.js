import '../styles/globals.css'
import ModalProvider from 'components/ModalsContext';

export default function App({ Component, pageProps }) {
  return (
    <ModalProvider>
      <Component {...pageProps} />
    </ModalProvider>
  ) 
}
