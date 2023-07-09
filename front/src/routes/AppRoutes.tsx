import { FunctionComponent } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import IndexPage from '../pages/IndexPage';
import SchedulePage from '../pages/SchedulePage';
import AnnouncementPage from '../pages/AnnouncementPage';
import { PagePath } from '../constants';

interface AppRoutesProps {
  hasProtectedAcess: boolean;
}

export const AppRoutes: FunctionComponent<AppRoutesProps> = ({
  hasProtectedAcess,
}) => {
  return (
    <Routes>
      <Route path={PagePath.home} element={<IndexPage />} />
      <Route path={PagePath.schedule}
        element={
          <ProtectedRoute allowed={hasProtectedAcess}>
            <SchedulePage />
          </ProtectedRoute>
        }
      />
      <Route path={PagePath.announcement}
        element={
          <ProtectedRoute allowed={hasProtectedAcess}>
            <AnnouncementPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};
