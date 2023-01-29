import '../styles/globals.css'
import ModalProvider from 'components/ModalsContext';
import { SessionProvider } from "next-auth/react"

export default function App({ Component, pageProps: {session, ...pageProps }}) {
  return (
    <SessionProvider session={session}>
      <ModalProvider>
        <Component {...pageProps} />
      </ModalProvider>
    </SessionProvider>
  ) 
}
