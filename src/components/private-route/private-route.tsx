import { Navigate, useLocation } from 'react-router-dom';
import { AppRoute, AuthorizationStatus } from '../../const';
import { useAppSelector } from '../../hooks';
import { getAuthStatus } from '../../store/slices/user-process/selectors';

type PrivateRouteProps = {
  redirectTo: typeof AppRoute[keyof typeof AppRoute];
  children: React.ReactElement;
}

export default function PrivateRoute({
  redirectTo = AppRoute.PAGE_404,
  children
}: PrivateRouteProps): React.ReactElement {

  const location: string = useLocation().pathname;
  const authStatus = useAppSelector(getAuthStatus);
  const isLoginPage = (location === String(AppRoute.LOGIN));
  const isUserLoggedIn = (authStatus === AuthorizationStatus.AUTH);

  return (
    (
      (isUserLoggedIn && !isLoginPage) || // Авторизованного пользователя при переходе на Login-page - редиректим на redirectTo
      (!isUserLoggedIn && isLoginPage) // Неавторизованному при переходе на Login-page - показываем children (Login page)
    )
      ? children
      : <Navigate to={redirectTo} />
  );
}
