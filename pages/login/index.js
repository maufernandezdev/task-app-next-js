import { useSession , signIn} from 'next-auth/react';
import styles from 'styles/Login.module.css'
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import github from 'public/github.svg'
import google from 'public/google.svg'
import Link from 'next/link'
import useSWRMutation from 'swr/mutation'
import { HiOutlineArrowNarrowLeft } from 'react-icons/hi'

async function sendRequest(url, { arg }) {
    return fetch(url, {
      method: 'POST',
      body: JSON.stringify(arg)
    })
}

export default function Login(){
    const { trigger } =  useSWRMutation('/api/users', sendRequest);
    const session = useSession();
    const router = useRouter();

    useEffect(() => {
        if(session.status === 'authenticated') 
        {
            const user = {
                email: session.data.user.email,
                name: session.data.user.name,
                projects:[]
            }
            handleLogin(user)
        }
    }, [session.status])

    const handleLogin = async (user) =>
    {
        const isCreated = await trigger(user);
        if(isCreated.status === 200) {
            const data = await isCreated.json();
            if(data)
            {
                router.push('/projects')
            }
        };
        // add toast error if status!=200
    }

    return (
        <section className={styles.loginContainer}>
            <h2>Registrarse</h2>
            <div className={styles.loginForm}>
                <button onClick={() => signIn('github')}>
                    <div><Image src={github} width={18} height={18} alt='github-img'></Image> Iniciar sessión con Github</div>
                </button>
                <button onClick={() => signIn('google')}>
                    <div><Image src={google} width={18} height={18} alt='google-img'></Image> Continuar con Google</div>
                </button>
            </div>
            <Link href='/'> <HiOutlineArrowNarrowLeft></HiOutlineArrowNarrowLeft> atrás</Link>
        </section>
    )

} 