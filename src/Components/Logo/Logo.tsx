import React, { FC } from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import logo from '../../images/logo.svg';
import './Logo.css';

export const Logo: FC = () => {
  const { t } = useTranslation();

  return (
    <NavLink to="/" className="logo">
      <img className="logo__image" src={logo} alt={t('logo_main')} />
    </NavLink>
  );
};
