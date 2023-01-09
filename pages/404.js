import Link from "next/link"
import styles from 'styles/NotFound.module.css'

const NotFound = () => {
  return (
    <div className={styles.container}>
        <h2>Ooops...</h2>
        <h2>Pagina no encontrada!</h2>
        <p>Volver al <Link href='/'>Inicio</Link> </p>
    </div>
  )
}

export default NotFound