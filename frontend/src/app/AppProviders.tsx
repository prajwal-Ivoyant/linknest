import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Spin, Flex } from 'antd';
import { store, persistor } from '../store';

const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false } },
});

const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <Provider store={store}>
        <PersistGate
            persistor={persistor}
            loading={
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
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </PersistGate>
    </Provider>
);

export default AppProviders;