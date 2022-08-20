import { useState } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { FiLogOut } from 'react-icons/fi';

import * as S from './styles';

export function MobileMenu({ linksMenu }) {
  const linksMenuMobile = linksMenu.filter((link) => link.showInMobile);
  const linksDrawer = linksMenu.filter((link) => !link.showInMobile);
  const [visible, setVisible] = useState(false);

  function handleLogout() {
    localStorage.removeItem('token');
    window.location.href = '/';
  }

  const handleOpenMenu = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  const checkIsActive = (url) => window.location.pathname.includes(url);

  return (
    <>
      <S.MobileMenu>
        {linksMenuMobile.map((link) => (
          <S.MobileMenuItem
            key={link.key}
            onClick={link.onClick}
            isActive={checkIsActive(link.url)}
          >
            {link.icon} <br />
            <span>{link.label}</span>
          </S.MobileMenuItem>
        ))}
        <S.MobileMenuItem onClick={handleOpenMenu}>
          <BsThreeDotsVertical /> <br />
          <span>Menu</span>
        </S.MobileMenuItem>
      </S.MobileMenu>

      <S.MobileMenuDrawer
        title="Meu Personal"
        placement="left"
        closable={false}
        onClose={onClose}
        visible={visible}
      >
        {linksDrawer.map((link) => (
          <S.MenuLink onClick={link.onClick} key={link.key}>
            {link.icon} {link.label}
          </S.MenuLink>
        ))}
        <S.MenuLink onClick={() => handleLogout()} isLast>
          <FiLogOut />
          Sair
        </S.MenuLink>
      </S.MobileMenuDrawer>
    </>
  );
}
