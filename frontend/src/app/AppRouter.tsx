import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate, } from 'react-router-dom';
import { Spin, Flex } from 'antd';
import { useAppSelector } from '../store/hooks';

const AuthPage = lazy(() => import('../pages/Auth'));
const LandingPage = lazy(() => import('../pages/Landing'));
const Dashboard = lazy(() => import('../pages/Dashboard'));

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated } = useAppSelector((s) => s.auth);
    return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const AppRouter = () => (
    <BrowserRouter>
        <Suspense
            fallback={
                <Flex
                    align="center"
                    justify="center"
                    style={{
                        minHeight: '100vh',
                        background: '#100f18',
                    }}
                >
                    <Spin size="large" />
                </Flex>
            }
        >
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<AuthPage />} />
                <Route path="/register" element={<AuthPage />} />
                <Route
                    path="/app"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Suspense>
    </BrowserRouter>
);

export default AppRouter;