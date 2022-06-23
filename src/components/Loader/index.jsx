import Lottie from 'lottie-react';
import gym from '../../assets/animations/gym-animation.json';

import * as S from './styles';

function Loader() {
  return (
    <S.Loader className="loader">
      <Lottie animationData={gym} loop />
    </S.Loader>
  );
}

export default Loader;
