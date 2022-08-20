import React, { useContext } from 'react';
import { BiLineChart } from 'react-icons/bi';

import { BsPeopleFill } from 'react-icons/bs';
import { CgGym, CgProfile } from 'react-icons/cg';
import { useNavigate } from 'react-router-dom';

import { ROLES } from '../../constants/roles';
import userContext from '../../contexts/userContext';
import { MobileMenu } from './MobileMenu';
import { SiderApp } from './SiderApp';
import * as S from './styles';

export function ContainerApp({ children }) {
  const navigate = useNavigate();
  const { user } = useContext(userContext);

  const getTrainersRoles = () => {
    if (user?.role === ROLES.ORIENTED) {
      return [];
    }
    return [
      {
        key: '1',
        icon: <CgGym />,
        onClick: () => navigate('/treinos'),
        url: '/treinos',
        label: 'Treinos',
        showInMobile: true,
      },
      {
        key: '2',
        icon: <BsPeopleFill />,
        onClick: () => navigate('/orientados'),
        url: '/orientados',
        label: 'Orientados',
        showInMobile: true,
      },
      {
        key: '3',
        icon: <BiLineChart />,
        onClick: () => navigate('/graficos'),
        url: '/graficos',
        label: 'Gráficos',
        showInMobile: false,
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
        icon: <CgProfile />,
        onClick: () => navigate(`perfil`),
        label: 'Meu perfil',
        url: '/perfil',
        showInMobile: true,
      },
      {
        key: '5',
        icon: <CgGym />,
        onClick: () => navigate(`orientados/${user.bdId}`),
        label: 'Treinos',
        url: '/treinos',
        showInMobile: true,
      },
    ];
  };

  const getCommonRoles = () => [];

  const linksMenu = [
    ...getTrainersRoles(),
    ...orientedsRoles(),
    ...getCommonRoles(),
  ].sort((a, b) => a.key - b.key);

  return (
    <S.AppLayout>
      <SiderApp collapsed linksMenu={linksMenu} />

      <S.Container>
        <S.Wrapper>{children}</S.Wrapper>
      </S.Container>

      <MobileMenu linksMenu={linksMenu} />
    </S.AppLayout>
  );
}
