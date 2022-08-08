import { Route, Routes } from 'react-router-dom';

import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Oriented } from './pages/Oriented';
import { Orienteds } from './pages/Orienteds';
import { OrientedWorkout } from './pages/OrientedWorkout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Users } from './pages/Users/index ';
import { Workouts } from './pages/Workouts';

export default function AppRoutes({ user }) {
  return (
    <Routes>
      <Route path="/" exact element={<Login />} />
      <Route element={<ProtectedRoute user={user} />}>
        <Route path="/inicio" exact element={<Home />} />
        <Route path="/orientados" exact element={<Orienteds />} />
        <Route path="/orientados/:id" exact element={<Oriented />} />
        <Route path="/treinos" exact element={<Workouts />} />
        <Route
          path="/orientados/:id/treino"
          exact
          element={<OrientedWorkout />}
        />
        <Route path="/usuarios" exact element={<Users />} />
      </Route>
    </Routes>
  );
}
