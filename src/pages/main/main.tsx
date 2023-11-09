import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import cn from 'classnames';

import { MainProps, PlacesProps } from './main-props';
import { changeCityAction } from '../../store/action';
import { getRightPluralForm } from '../../utils/common';
import { Offer } from '../../types/offer';

import OffersList from '../../components/offers-list/offers-list';
import CitiesList from '../../components/cities-list/cities-list';
import Sort from '../../components/sort/sort';
import Map from '../../components/map/map';

const enum CSSCLasses {
  PlacesContainer = 'cities__places-container container',
  NoPlaces = 'cities__places-container--empty'
}

function MainEmpty(): React.ReactNode {
  return (
    <section className="cities__no-places">
      <div className="cities__status-wrapper tabs__content">
        <b className="cities__status">No places to stay available</b>
        <p className="cities__status-description">We could not find any property available at the moment in Dusseldorf</p>
      </div>
    </section>
  );
}

function Places({ offers, onSelectPoint }: PlacesProps): React.ReactNode {

  function sortChangeHandler(currentSort: string) {
    /* КОД РЕАЛИЗАЦИИ СОРТИРОВКИ */
    console.log('Sort changed!', currentSort);
  }

  return (
    <section className="cities__places places">
      <h2 className="visually-hidden">Places</h2>
      <b className="places__found">{ offers.length } { getRightPluralForm('place', offers.length) } to stay in Amsterdam</b>

      <Sort onSortChange={ sortChangeHandler } />

      <div className="cities__places-list places__list tabs__content">
        <OffersList offers={ offers } onSelectPoint={ onSelectPoint }></OffersList>
      </div>
    </section>
  );
}

export default function Main({
  cities,
  mapPoints,
  offers,
  isMainEmpty
}: MainProps): React.ReactNode {
  const dispatch = useAppDispatch();
  const currentCity = useAppSelector((state) => state.city);
  const [selectedPoint, setSelectedPoint] = useState<Offer | null>(null);

  function selectCityHandler(evt: React.MouseEvent<HTMLElement, MouseEvent>) {
    const target = (evt.target as HTMLElement);
    const targetCity = target.textContent;
    const selectedCity = cities.find((city) => city.name === targetCity);

    if(selectedCity !== undefined) {
      dispatch(changeCityAction({ city: selectedCity }));
    }
  }

  return (
    <>
      <Helmet>
        <title>6 cities - Main</title>
      </Helmet>
      <h1 className="visually-hidden">Cities</h1>
      <div className="tabs">
        <section className="locations container">
          { cities && <CitiesList cities={ cities } onSelectCity={ selectCityHandler } /> }
        </section>
      </div>
      <div className="cities">
        <div className={ cn(
          CSSCLasses.PlacesContainer,
          {[CSSCLasses.NoPlaces]: isMainEmpty}
        ) }
        >
          { (isMainEmpty && <MainEmpty />)
            || <Places offers={ offers } onSelectPoint={ setSelectedPoint }/> }

          <div className="cities__right-section">
            { !isMainEmpty && <Map city={ currentCity } mapPoints={ mapPoints } selectedPoint={ selectedPoint }/>}
          </div>
        </div>
      </div>
    </>
  );
}
