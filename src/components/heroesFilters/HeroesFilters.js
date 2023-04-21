import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useHttp } from '../../hooks/http.hook';
import { filtersFetching, filtersFetched, filtersFetchingError, heroesFiltring, heroesAll } from '../../actions';

// Задача для этого компонента:
// Фильтры должны формироваться на основании загруженных данных
// Фильтры должны отображать только нужных героев при выборе
// Активный фильтр имеет класс active
// Изменять json-файл для удобства МОЖНО!
// Представьте, что вы попросили бэкенд-разработчика об этом

const HeroesFilters = () => {
    const { filters, filtersLoadingStatus } = useSelector(state => state);
    const dispatch = useDispatch();
    const { request } = useHttp();
    const buttonRefs = useRef([]);

    useEffect(() => {
        dispatch(filtersFetching());
        request("http://localhost:3001/filters")
            .then(data => dispatch(filtersFetched(data)))
            .catch(() => dispatch(filtersFetchingError()));

        // eslint-disable-next-line
    }, []);

    const focusOnItem = (id) => {
        buttonRefs.current.forEach(item => item.classList.remove('active'));
        buttonRefs.current[id].classList.add('active');
        buttonRefs.current[id].focus();
    }

    const renderFilterButtons = (arr) => {
        if (filtersLoadingStatus === 'error') {
            return <div className='text-danger'>Ошибка загрузки фильтров</div>
        } else if (filtersLoadingStatus === 'loading') {
            return <div>Фильтры загружаются...</div>
        } else if (arr.length === 0) {
            return <div>Фильтров пока нет...</div>
        }

        const elements = arr.map(({ element, descr, style }, i) => {
            return <button
                ref={el => buttonRefs.current[i + 1] = el}
                key={i + 1}
                className={`btn btn-${style}`}
                onClick={() => {
                    focusOnItem(i + 1);
                    dispatch(heroesFiltring(element));
                }}
                onKeyDown={(e) => {
                    if (e.key === ' ' || e.key === "Enter") {
                        focusOnItem(i + 1);
                        dispatch(heroesFiltring(element));
                    }
                }}
            >{descr}</button>
        })

        return (
            <>
                <button
                    key={0}
                    ref={el => buttonRefs.current[0] = el}
                    className="btn btn-outline-dark active"
                    onClick={() => {
                        focusOnItem(0);
                        dispatch(heroesAll());
                    }}
                    onKeyDown={(e) => {
                        if (e.key === ' ' || e.key === "Enter") {
                            focusOnItem(0);
                            dispatch(heroesAll());
                        }
                    }}
                >
                    Все
                </button>
                {elements}
            </>
        )
    }

    return (
        <div className="card shadow-lg mt-4">
            <div className="card-body">
                <p className="card-text">Отфильтруйте героев по элементам</p>
                <div className="btn-group">
                    {renderFilterButtons(filters)}
                </div>
            </div>
        </div>
    )
}

export default HeroesFilters;