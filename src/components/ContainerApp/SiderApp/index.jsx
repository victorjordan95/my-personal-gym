import { Menu } from 'antd';

import LogoIcon from '../../Icons/Logo';
import * as S from './styles';

export function SiderApp({ collapsed, setCollapsed, linksMenu }) {
  return (
    <S.AppSider
      collapsible={false}
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
    >
      <LogoIcon className="logo" />
      <Menu
        theme="dark"
        defaultSelectedKeys={['1']}
        mode="inline"
        items={linksMenu}
      />
      <a href="/home">Logout</a>
    </S.AppSider>
  );
}
