import { useSession , signIn} from 'next-auth/react';
import styles from 'styles/Login.module.css'
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import github from 'public/github.svg'
import google from 'public/google.svg'
import Link from 'next/link'
import { HiOutlineArrowNarrowLeft } from 'react-icons/hi'

export default function Login(){
    const session = useSession();
    const router = useRouter()
    useEffect(() => {
        if(session.status === 'authenticated') router.push('/projects')
    }, [session.status])
    return (
        <section className={styles.loginContainer}>
            <h2>Registrarse</h2>
            <div className={styles.loginForm}>
                <button onClick={() => signIn('github')}>
                    <div><Image src={github} width={18} height={18}></Image> Iniciar sessión con Github</div>
                </button>
                <button onClick={() => signIn('google')}>
                    <div><Image src={google} width={18} height={18}></Image> Continuar con Google</div>
                </button>
            </div>
            <Link href='/'> <HiOutlineArrowNarrowLeft></HiOutlineArrowNarrowLeft> atrás</Link>
        </section>
    )

} 