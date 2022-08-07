import { FormLogin } from './components/Form';

import * as S from './styles';

export function Login() {
  return (
    <S.Container>
      <FormLogin className="form-login" />
      <S.Background />
    </S.Container>
  );
}
