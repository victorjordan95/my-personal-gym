import React, { useContext } from 'react';
import { BiLineChart } from 'react-icons/bi';
import { MdOutlineAdminPanelSettings } from 'react-icons/md';

import { BsPeopleFill } from 'react-icons/bs';
import { CgGym, CgProfile } from 'react-icons/cg';
import { useNavigate } from 'react-router-dom';

import userContext from '../../contexts/userContext';
import { isAdmin, isOriented } from '../../utils/checkRoles';
import { isMobile } from '../../utils/detectSizeScreen';
import { MobileMenu } from './MobileMenu';
import { SiderApp } from './SiderApp';
import * as S from './styles';

export function ContainerApp({ children }) {
  const navigate = useNavigate();
  const { user } = useContext(userContext);

  const getAdminRoles = () => {
    const roles = [];
    if (isAdmin(user?.role)) {
      roles.push({
        key: '6',
        label: 'Usuários',
        icon: <MdOutlineAdminPanelSettings />,
        url: '/perfil',
        onClick: () => navigate('usuarios'),
        showInMobile: false,
      });
    }
    return roles;
  };

  const getTrainersRoles = () => {
    if (isOriented(user?.role)) {
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
      // {
      //   key: '3',
      //   icon: <BiLineChart />,
      //   onClick: () => navigate('/graficos'),
      //   url: '/graficos',
      //   label: 'Gráficos',
      //   showInMobile: false,
      // },
    ];
  };

  const orientedsRoles = () => {
    if (!isOriented(user?.role)) {
      return [];
    }

    const mobileMenu = [
      {
        key: '4',
        icon: <CgProfile />,
        onClick: () => navigate(`perfil`),
        label: 'Meu perfil',
        url: '/perfil',
        showInMobile: true,
      },
    ];

    return [
      ...((isMobile() && mobileMenu) || []),
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
    ...getAdminRoles(),
    ...getCommonRoles(),
    ...getTrainersRoles(),
    ...orientedsRoles(),
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
