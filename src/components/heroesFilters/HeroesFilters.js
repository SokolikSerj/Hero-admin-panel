import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import store from '../../store';

import { useHttp } from '../../hooks/http.hook';
import { fetchFilters, changeFilter, selectAll } from './filtersSlice';

const HeroesFilters = () => {
    const { filtersLoadingStatus, activeFilter } = useSelector(state => state.filters);
    const filters = selectAll(store.getState());
    const dispatch = useDispatch();
    const { request } = useHttp();

    useEffect(() => {
        dispatch(fetchFilters(request));
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