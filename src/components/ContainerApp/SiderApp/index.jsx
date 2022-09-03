/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { Dropdown, Menu } from 'antd';
import { useContext } from 'react';
import { HiOutlineUserCircle } from 'react-icons/hi';
import { Link, useNavigate } from 'react-router-dom';
import userContext from '../../../contexts/userContext';
import { isTrainer } from '../../../utils/checkRoles';

import LogoIcon from '../../Icons/Logo';
import * as S from './styles';

function handleLogout() {
  localStorage.removeItem('token');
  window.location.href = '/';
}

export function SiderApp({ collapsed, setCollapsed, linksMenu }) {
  const { user } = useContext(userContext);
  const navigate = useNavigate();

  const handleClickRedirect = (route) => {
    navigate(route);
  };

  const redirectTrainerRoute = () => {
    navigate(`/orientados/${user?.bdId}`);
  };

  const trainerMenu = [
    {
      ...(isTrainer(user?.role) && {
        label: <span onClick={() => redirectTrainerRoute()}>Meu treino</span>,
        key: '2',
      }),
    },
  ];

  const menu = (
    <Menu
      items={[
        ...(trainerMenu || []),
        {
          label: (
            <span onClick={() => handleClickRedirect('perfil')}>Perfil</span>
          ),
          key: '0',
        },
        {
          type: 'divider',
        },
        {
          label: <span onClick={handleLogout}>Sair</span>,
          key: '1',
        },
      ]}
    />
  );

  return (
    <S.AppSider
      collapsible={false}
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
    >
      <Link to="inicio" style={{ margin: '0 auto' }}>
        <LogoIcon className="logo" />
      </Link>
      <Menu theme="dark" mode="inline" items={linksMenu} />
      <S.FooterMenu>
        <Dropdown overlay={menu} trigger={['click']}>
          <a onClick={(e) => e.preventDefault()}>
            <HiOutlineUserCircle />
          </a>
        </Dropdown>
      </S.FooterMenu>
    </S.AppSider>
  );
}
