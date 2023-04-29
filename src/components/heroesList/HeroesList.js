import { useHttp } from '../../hooks/http.hook';
import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { createSelector } from '@reduxjs/toolkit';

import { fetchHeroes } from './heroesSlice';
import { heroDeleted } from './heroesSlice';
import HeroesListItem from "../heroesListItem/HeroesListItem";
import Spinner from '../spinner/Spinner';

import './heroesList.scss';

// Задача для этого компонента:
// При клике на "крестик" идет удаление персонажа из общего состояния
// Усложненная задача:
// Удаление идет и с json файла при помощи метода DELETE

const HeroesList = () => {
    const filtredHeroesSelector = createSelector(
        (state) => state.filters.activeFilter,
        (state) => state.heroes.heroes,
        (filter, heroes) => {
            return filter === 'all' ? heroes : heroes.filter(item => item.element === filter);
        }
    );


    /* const filteredHeroes = useSelector(state => {
        return state.filters.activeFilter === 'all' ? state.heroes.heroes : state.heroes.heroes.filter(item => item.element === state.filters.activeFilter);
    }) */
    const filteredHeroes = useSelector(filtredHeroesSelector);
    const heroesLoadingStatus = useSelector(state => state.heroes.heroesLoadingStatus);
    const dispatch = useDispatch();
    const { request } = useHttp();

    useEffect(() => {
        dispatch(fetchHeroes());
        // eslint-disable-next-line
    }, []);

    const deleteItem = useCallback((id) => {
        request(`http://localhost:3001/heroes/${id}`, "DELETE")
            .then(console.log(`Deleted a hero ${id}`))
            .then(dispatch(heroDeleted(id)))
            .catch((e) => console.log(e));
        // eslint-disable-next-line
    }, [request])

    if (heroesLoadingStatus === "loading") {
        return <Spinner />;
    } else if (heroesLoadingStatus === "error") {
        return <h5 className="text-center mt-5">Ошибка загрузки</h5>
    }

    const renderHeroesList = (arr) => {
        if (arr.length === 0) {
            return (
                <CSSTransition
                    timeout={0}
                    classNames="hero"
                >
                    <h5 className="text-center mt-5">Героев пока нет</h5>
                </CSSTransition>
            )
        }

        return arr.map(({ id, ...props }) => {
            return (
                <CSSTransition
                    key={id}
                    timeout={500}
                    classNames="hero"
                >
                    <HeroesListItem {...props} deleteItem={() => deleteItem(id)} />
                </CSSTransition>
            )
        })
    }

    const elements = renderHeroesList(filteredHeroes);
    return (
        <TransitionGroup component='ul'>
            {elements}
        </TransitionGroup>
    )
}

export default HeroesList;