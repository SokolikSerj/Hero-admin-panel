import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

import { useHttp } from '../../hooks/http.hook';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';

import { filtersFetching, filtersFetched, filtersFetchingError, heroesFetching, heroesFetched, heroesFetchingError } from '../../actions';
import Spinner from '../spinner/Spinner';

// Задача для этого компонента:
// Реализовать создание нового героя с введенными данными. Он должен попадать
// в общее состояние и отображаться в списке + фильтроваться
// Уникальный идентификатор персонажа можно сгенерировать через uiid
// Усложненная задача:
// Персонаж создается и в файле json при помощи метода POST
// Дополнительно:
// Элементы <option></option> желательно сформировать на базе
// данных из фильтров

const HeroesAddForm = () => {
    const { filters, filtersLoadingStatus } = useSelector(state => state);
    const dispatch = useDispatch();
    const { request } = useHttp();

    useEffect(() => {
        dispatch(filtersFetching());
        request("http://localhost:3001/filters")
            .then(data => dispatch(filtersFetched(data)))
            .catch(() => dispatch(filtersFetchingError()))

        // eslint-disable-next-line
    }, []);

    const renderFilterList = (arr) => {
        const options = arr.length > 0 ?
            arr.map(({ element, descr }, i) => {
                return <option key={i} value={element}>{descr}</option>
            }) : null;

        return (
            <Field
                as="select"
                className="form-select"
                id="element"
                name="element"
            >
                {filtersLoadingStatus === 'error' ? <option value="">Элементы на загружены</option> : <option value="">Я владею элементом...</option>}
                {options}
            </Field>
        )
    }

    const updateHero = () => {
        dispatch(heroesFetching());
        request("http://localhost:3001/heroes")
            .then(data => dispatch(heroesFetched(data)))
            .catch(() => dispatch(heroesFetchingError()))
    }

    const addHero = ({ name, text, element }) => {
        const hero = {
            "id": uuidv4(),
            "name": name,
            "description": text,
            "element": element
        }
        request("http://localhost:3001/heroes", "POST", JSON.stringify(hero))
            .then(() => updateHero())
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
                    {renderFilterList(filters)}
                    <ErrorMessage component="div" className="error" name="element" />
                    {filtersLoadingStatus === 'loading' ? <Spinner /> : null}
                </div>

                <button type="submit" className="btn btn-primary">Создать</button>
            </Form>
        </Formik>
    )
}

export default HeroesAddForm;