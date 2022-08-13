/* eslint-disable no-unused-vars */
import { Layout } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { CgGym } from 'react-icons/cg';
import { BsPeopleFill } from 'react-icons/bs';
import { BiLineChart } from 'react-icons/bi';
import { SiderApp } from './SiderApp';

import * as S from './styles';
import userContext from '../../contexts/userContext';
import { ROLES } from '../../constants/roles';

export function ContainerApp({ children }) {
  const navigate = useNavigate();
  const { user } = useContext(userContext);
  const [collapsed, setCollapsed] = useState(true);

  const getTrainersRoles = () => {
    if (user?.role === ROLES.ORIENTED) {
      return [];
    }
    return [
      {
        key: '1',
        icon: <CgGym />,
        onClick: () => navigate('/treinos'),
        label: 'Treinos',
      },
      {
        key: '2',
        icon: <BsPeopleFill />,
        onClick: () => navigate('/orientados'),
        label: 'Orientados',
      },
      {
        key: '3',
        icon: <BiLineChart />,
        onClick: () => navigate('/graficos'),
        label: 'Gráficos',
      },
    ];
  };

  const orientedsRoles = () => {
    if (user?.role !== ROLES.ORIENTED) {
      return [];
    }
    return [
      {
        key: '1',
        icon: <CgGym />,
        onClick: () => navigate(`orientados/${user.bdId}`),
        label: 'Treinos',
      },
    ];
  };

  const getCommonRoles = () => [{}];

  const linksMenu = [
    ...getTrainersRoles(),
    ...orientedsRoles(),
    ...getCommonRoles(),
  ].sort((a, b) => a.key - b.key);

  return (
    <S.AppLayout>
      <SiderApp collapsed={collapsed} linksMenu={linksMenu} />

      <S.Container>
        <S.Wrapper>{children}</S.Wrapper>
      </S.Container>

      <S.MobileMenu>
        {linksMenu.map((link) => (
          <S.MobileMenuItem key={link.key} onClick={link.onClick}>
            {link.icon} <br />
            <span>{link.label}</span>
          </S.MobileMenuItem>
        ))}
      </S.MobileMenu>
    </S.AppLayout>
  );
}
