import { useState } from 'react';

const useForm = (initialForm, initialErrors, validateForm) => {

    const [values, setValues ] = useState( initialForm );
    const [errors, setErrors] = useState( initialErrors );

    const handleInputChange = ({ target }) =>
    {   
        if(target.name && target.name !== '')
        {
            setValues({
                ...values,
                [target.name]: target.value
            });

        }
        setErrors(validateForm(values));
    }; 

    const handleBlur = (e) => {
        handleInputChange(e);
        setErrors(validateForm(values));
    };

    return {
        values,
        errors,
        handleInputChange,
        handleBlur
    }
}

export default useForm;