import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useHttp } from '../../hooks/http.hook';
import { filtersFetching, filtersFetched, filtersFetchingError, changeFilter } from '../../actions';

const HeroesFilters = () => {
    const { filters, filtersLoadingStatus, activeFilter } = useSelector(state => state.filters);
    const dispatch = useDispatch();
    const { request } = useHttp();

    useEffect(() => {
        dispatch(filtersFetching());
        request("http://localhost:3001/filters")
            .then(data => dispatch(filtersFetched(data)))
            .catch(() => dispatch(filtersFetchingError()));

        // eslint-disable-next-line
    }, []);
    const renderFilterButtons = (arr) => {
        if (filtersLoadingStatus === 'error') {
            return <div className='text-danger'>Ошибка загрузки фильтров</div>
        } else if (filtersLoadingStatus === 'loading') {
            return <div>Фильтры загружаются...</div>
        } else if (arr.length === 0) {
            return <div>Фильтров пока нет...</div>
        }

        return (
            <>
                {arr.map(({ element, descr, style }, i) => {
                    const activeStyle = activeFilter ===  element ? 'active' : '';
                    return <button
                        key={i}
                        className={`btn btn-${style} ${activeStyle}`}
                        onClick={() => {
                            dispatch(changeFilter(element));
                        }}
                        onKeyDown={(e) => {
                            if (e.key === ' ' || e.key === "Enter") {
                                dispatch(changeFilter(element));
                            }
                        }}
                    >{descr}</button>
                })}
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