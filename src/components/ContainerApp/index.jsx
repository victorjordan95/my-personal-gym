/* eslint-disable no-unused-vars */
import { Layout } from 'antd';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { CgGym } from 'react-icons/cg';
import { BsPeopleFill } from 'react-icons/bs';
import { BiLineChart } from 'react-icons/bi';
import { SiderApp } from './SiderApp';

import * as S from './styles';

export function ContainerApp({ children }) {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(true);

  const linksMenu = [
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
