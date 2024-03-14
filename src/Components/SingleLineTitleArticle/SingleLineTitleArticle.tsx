import React, { FC } from 'react';
import './SingleLineTitleArticle.css';
import { Link } from 'react-router-dom';

interface Props {
  id: number;
  image: string;
  title: string;
  text: string;
  category: string;
  source: string;
}

export const SingleLineTitleArticle: FC<Props> = ({ image, title, source, text, category, id }) => {
  return (
    <Link to={`/article/${id}`} className="single-line-title-article">
      <article className="single-line-title-article__container">
        <img alt="single_article" className="single-line-title-article__image" src={image} />
        <span className="article-category single-line-title-article__category">{category}</span>
        <h2 className="single-line-title-article__title">{title}</h2>
        <p className="single-line-title-article__text">{text}</p>
        <span className="article-source single-line-title-article__source">{source}</span>
      </article>
    </Link>
  );
};
