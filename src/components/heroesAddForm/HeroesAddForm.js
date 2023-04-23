import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';

import { useHttp } from '../../hooks/http.hook';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

import { heroAdded } from '../../actions';

const HeroesAddForm = () => {
    const { filters, filtersLoadingStatus } = useSelector(state => state);
    const dispatch = useDispatch();
    const { request } = useHttp();

    const renderFilterOptions = (arr) => {
        const options = arr.length > 0 ?
            arr.map(({ element, descr }, i) => {
                return element !== 'all' ? <option key={i} value={element}>{descr}</option> : null
            }) : null;

        return (
            <Field
                as="select"
                className="form-select"
                id="element"
                name="element"
            >
                {filtersLoadingStatus === 'error' ? <option value=""> Элементы не загружены</option> : filtersLoadingStatus === 'loading' ? <option value="">Элементы загружаются...</option> : <option value="">Я владею элементом...</option>}
                {options}
            </Field>
        )
    }

    const addHero = ({ name, text, element }) => {
        const hero = {
            "id": uuidv4(),
            "name": name,
            "description": text,
            "element": element
        }
        request("http://localhost:3001/heroes", "POST", JSON.stringify(hero))
            .then(() => dispatch(heroAdded(hero)))
            .then((data) => console.log(`Hero added`, data.payload))
            .catch((e) => console.log(e))
    }

    return (
        <Formik
            initialValues={{
                name: '',
                text: '',
                element: ''
            }}
            validationSchema={Yup.object({
                name: Yup.string()
                    .required('Это поле обязательно!'),
                text: Yup.string()
                    .required('Это поле обязательно!'),
                element: Yup.string()
                    .required('Это поле обязательно!')
            })}
            onSubmit={values => {
                addHero(values);
            }}
        >
            <Form className="border p-4 shadow-lg rounded">
                <div className="mb-3">
                    <label htmlFor="name" className="form-label fs-4">Имя нового героя</label>
                    <Field
                        type="text"
                        name="name"
                        className="form-control"
                        id="name"
                        placeholder="Как меня зовут?" />
                    <ErrorMessage component="div" className="error" name="name" />
                </div>

                <div className="mb-3">
                    <label htmlFor="text" className="form-label fs-4">Описание</label>
                    <Field
                        as="textarea"
                        name="text"
                        className="form-control"
                        id="text"
                        placeholder="Что я умею?"
                        style={{ "height": '130px' }} />
                    <ErrorMessage component="div" className="error" name="text" />
                </div>

                <div className="mb-3">
                    <label htmlFor="element" className="form-label">Выбрать элемент героя</label>
                    {renderFilterOptions(filters)}
                    <ErrorMessage component="div" className="error" name="element" />
                </div>

                <button type="submit" className="btn btn-primary">Создать</button>
            </Form>
        </Formik>
    )
}

export default HeroesAddForm;