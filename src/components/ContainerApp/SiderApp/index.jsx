import { Menu } from 'antd';
import { FiLogOut } from 'react-icons/fi';
import { Link } from 'react-router-dom';

import LogoIcon from '../../Icons/Logo';
import * as S from './styles';

export function SiderApp({ collapsed, setCollapsed, linksMenu }) {
  function handleLogout() {
    localStorage.removeItem('token');
    window.location.href = '/';
  }

  return (
    <S.AppSider
      collapsible={false}
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
    >
      <Link to="inicio" style={{ margin: '0 auto' }}>
        <LogoIcon className="logo" />
      </Link>
      <Menu
        theme="dark"
        // defaultSelectedKeys={['1']}
        mode="inline"
        items={linksMenu}
      />
      <span
        role="link"
        onClick={handleLogout}
        className="app-sider__logout"
        tabIndex={0}
      >
        <FiLogOut width={40} height={40} />
      </span>
    </S.AppSider>
  );
}
