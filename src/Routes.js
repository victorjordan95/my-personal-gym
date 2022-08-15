import { Route, Routes } from 'react-router-dom';

import { ProtectedRoute } from './components/ProtectedRoute/general';
import { TrainersRoute } from './components/ProtectedRoute/trainers';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { NotFound } from './pages/NotFound';
import { Oriented } from './pages/Oriented';
import { Orienteds } from './pages/Orienteds';
import { OrientedWorkout } from './pages/OrientedWorkout';
import { Profile } from './pages/Profile';
import { Users } from './pages/Users/index ';
import { Workouts } from './pages/Workouts';

export default function AppRoutes({ user }) {
  return (
    <Routes>
      <Route path="/" exact element={<Login />} />

      <Route element={<ProtectedRoute user={user} />}>
        <Route path="/nao-encontrado" exact element={<NotFound />} />
        <Route path="/inicio" exact element={<Home />} />
        <Route path="/orientados/:id" exact element={<Oriented />} />
        <Route
          path="/orientados/:id/treino"
          exact
          element={<OrientedWorkout />}
        />
        <Route path="/perfil" exact element={<Profile />} />

        <Route element={<TrainersRoute user={user} />}>
          <Route path="/orientados" exact element={<Orienteds />} />
          <Route path="/treinos" exact element={<Workouts />} />
          <Route path="/usuarios" exact element={<Users />} />
        </Route>
      </Route>
    </Routes>
  );
}
