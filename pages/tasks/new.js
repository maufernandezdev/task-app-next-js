import { Inter } from '@next/font/google'
const inter = Inter({ subsets: ['latin'] })
import styles from 'styles/Home.module.css'
import { useRouter } from "next/router";
import useForm from 'hooks/useForm';
import toast, { Toaster } from 'react-hot-toast';
import useSWRMutation from 'swr/mutation'

async function sendRequest(url, { arg }) {
  return fetch(url, {
    method: 'POST',
    body: JSON.stringify(arg)
  })
}

export default function New(){

    const { trigger } = useSWRMutation('/api/tasks', sendRequest)
    const router = useRouter();

    const initialForm = {
        title: '',
        description: '',
        border:'1798B5'
    };

    const notify = () => toast.success('Tarea creada!',{
        duration: 1500,
        style: {
            fontFamily:'ui-monospace, Menlo, Monaco, Cascadia Mono, Segoe UI Mono, Roboto Mono, Oxygen Mono, Ubuntu Monospace, Source Code Pro, Fira Mono, Droid Sans Mono, Courier New, monospace'},
        },
    );

    const validationsForm = (values) => 
    {
        let errors = {};
        let regexTitle = /^.{1,40}$/;
        let regexDescription = /^.{1,200}$/;

        
        if (!values.title.trim())
        {
            errors.title = "El campo 'Título' es requerido";
        }
        else if (!regexTitle.test(values.title.trim()))
        {
            errors.title = "El título excede los 40 caracteres";
        }
        
        if (!values.description.trim())
        { 
            errors.description = "El campo 'Descripción' es requerido";
        } 
        else if (!regexDescription.test(values.description.trim()))
        {
            errors.description = "La descripción excede los 200 caracteres";
        }

        return errors;
    }

    const { values, errors , handleInputChange , handleBlur} = useForm(initialForm, validationsForm);
    
    const handleSubmit = async (e) =>
    {
        e.preventDefault();
        if (Object.keys(errors).length === 0)
        {
            console.log(values);
            const isCreated = await trigger(values);
            if(isCreated.status === 200)
            {
                notify();
                setTimeout(() => {
                    router.push('/tasks');
                }, 1500);
            }
            // manejar los errores del servidor y mostrar al usuario
            // tarea con mismo nombre que otra
            
        }
    }
    
    return(
        <div className={styles.container}>
            <h1 className={inter.className} style={{ textAlign: 'center'}}>Nueva tarea</h1>
            <form className={styles.form} onSubmit={handleSubmit}>
                <label className={styles.form__label} >Título</label>
                <input 
                    type='text'
                    name='title'
                    className={errors.title? styles.form__input : styles.form__valid}
                    placeholder='Ingrese un título'
                    onChange={e => handleInputChange(e)}
                    onBlur={handleBlur}
                    required
                    value={values.title || ''}
                    autoFocus
                />
                {errors.title && <p className={styles.form__error}>{errors.title}</p>}

                <label className={styles.form__label}>Descripción</label>
                <textarea 
                    name='description'
                    className={errors.description? styles.form__input : styles.form__valid}
                    cols='30' rows='10'
                    placeholder='Ingrese una descripción'
                    onChange={e => handleInputChange(e)}
                    onBlur={handleBlur}
                    required
                    value={values.description || ''}
                />
                {errors.description && <p className={styles.form__error}>{errors.description}</p>}
                {/* <input type='text'   className={styles.form__input} placeholder='Ingrese una descripción'/> */}
                <input type='submit' className={styles.form__input} value='Añadir tarea' />
            </form>
            <Toaster className={styles.customToast}/>
        </div>
        
    )
} 