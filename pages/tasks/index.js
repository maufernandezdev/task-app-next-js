import { Inter } from '@next/font/google'
const inter = Inter({ subsets: ['latin'] })
import useSWR from 'swr'
import Card from 'components/card/Card'
import styles from 'styles/Home.module.css'
import { useRouter } from "next/router";

const fetcher = (...args) => fetch(...args).then(res => res.json())

export default function Tasks() {
  const router = useRouter();
  const { data, error } = useSWR('/api/tasks', fetcher);
  return (
    <>
      <div className={styles.container}>
        <div className={styles.container__header}>
          <div>
            <h1 className={inter.className}>¡Hola, usuario!</h1>
            <h3 className={styles.container__header_h3}>¡Que tengas un lindo día!</h3>
          </div>
          <button className={styles.card__button} onClick={()=> router.push('tasks/new')}>+ Añadir otra tarea</button>
        </div>
            {
              data? (
                data.map((task) => {
                    return(
                      <Card task = { task } key = { task._id } ></Card>
                      )
                })
              ) : <div>Cargando ...</div>
            }
      </div>
    </>
  )
}
