import { useHttp } from '../../hooks/http.hook';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { heroesFetching, heroesFetched, heroesFetchingError } from '../../actions';
import HeroesListItem from "../heroesListItem/HeroesListItem";
import Spinner from '../spinner/Spinner';

// Задача для этого компонента:
// При клике на "крестик" идет удаление персонажа из общего состояния
// Усложненная задача:
// Удаление идет и с json файла при помощи метода DELETE

const HeroesList = () => {
    const { heroes, heroesLoadingStatus, heroesFilter, heroesIsFiltring } = useSelector(state => state);
    const dispatch = useDispatch();
    const { request } = useHttp();

    useEffect(() => {
        dispatch(heroesFetching());
        updateHero();
        // eslint-disable-next-line
    }, []);

    const updateHero = () => {
        request("http://localhost:3001/heroes")
            .then(data => dispatch(heroesFetched(data)))
            .catch(() => dispatch(heroesFetchingError()))
    }

    if (heroesLoadingStatus === "loading") {
        return <Spinner />;
    } else if (heroesLoadingStatus === "error") {
        return <h5 className="text-center mt-5">Ошибка загрузки</h5>
    }

    const deleteItem = (id) => {
        request(`http://localhost:3001/heroes/${id}`, "DELETE")
            .then(() => updateHero())
            .catch((e) => console.log(e));

    }

    const renderHeroesList = (arr) => {
        if (arr.length === 0) {
            return <h5 className="text-center mt-5">Героев пока нет</h5>
        }

        return arr.map(({ id, ...props }) => {
            return <HeroesListItem key={id} deleteItem={() => deleteItem(id)} {...props} />
        })
    }

    console.log(heroesIsFiltring);

    const elements = heroesIsFiltring ? renderHeroesList(heroesFilter) : renderHeroesList(heroes);
    return (
        <ul>
            {elements}
        </ul>
    )
}

export default HeroesList;