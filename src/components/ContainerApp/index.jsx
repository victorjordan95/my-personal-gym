/* eslint-disable no-unused-vars */
import React, { useContext, useState } from 'react';
import { BiLineChart } from 'react-icons/bi';
import { BsPeopleFill } from 'react-icons/bs';
import { CgGym } from 'react-icons/cg';
import { useNavigate } from 'react-router-dom';

import { ROLES } from '../../constants/roles';
import userContext from '../../contexts/userContext';
import { SiderApp } from './SiderApp';
import * as S from './styles';

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
        key: '4',
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
