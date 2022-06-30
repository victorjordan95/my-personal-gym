import { Route, Routes } from 'react-router-dom';

import { ProtectedRoute } from './components/ProtectedRoute';
import { Home } from './pages/Home';
import { Oriented } from './pages/Oriented';
import { Orienteds } from './pages/Orienteds';
import { OrientedWorkout } from './pages/OrientedWorkout';
import Workouts from './pages/Workouts';

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<ProtectedRoute user={{ id: 1, user: 'victor' }} />}>
        <Route path="/inicio" exact element={<Home />} />
        <Route path="/treinos" exact element={<Workouts />} />
        <Route path="/orientados" exact element={<Orienteds />} />
        <Route path="/orientados/:id" exact element={<Oriented />} />
        <Route
          path="/orientados/:id/treino"
          exact
          element={<OrientedWorkout />}
        />
      </Route>
    </Routes>
  );
}
