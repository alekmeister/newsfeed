import { Navigation } from '../Navigation/Navigation';
import { Articles } from '../Articles/Articles';
import React, { FC, useEffect } from 'react';
import './App.css';
import { Route, Switch, useLocation } from 'react-router-dom';
import { ArticleItem } from '../ArticleItem/ArticleItem';

export const App: FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      <header className="header">
        <div className="container">
          <Navigation placement="header" className="header__navigation" />
        </div>
      </header>

      <main>
        <Switch>
          <Route path="/article/:id">
            <ArticleItem />
          </Route>
          <Route path="/:categoryId">
            <Articles />
          </Route>
          <Route path="/">
            <Articles />
          </Route>
        </Switch>
      </main>
      <footer className="footer">
        <div className="container">
          <Navigation placement="footer" className="footer__navigation" />
          <div className="footer__bottom">
            <p className="footer__text">
              Сделано на Frontend курсе в{' '}
              <a rel="noreferrer" className="footer__link" href="https://karpov.courses/frontend" target="_blank">
                Karpov.Courses
              </a>
            </p>
            <p className="footer__text footer__text--gray">© 2021</p>
          </div>
        </div>
      </footer>
    </>
  );
};
