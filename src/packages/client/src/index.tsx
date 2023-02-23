import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { store } from './app/store';
import { Provider } from 'react-redux';
import debug from 'debug';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import UserInteractionListener from './features/user-interaction/components/UserInteractionListener';

const queryClient = new QueryClient();

debug.log = console.info.bind(console);

ReactDOM.render(
   <React.StrictMode>
      <QueryClientProvider client={queryClient}>
         <Provider store={store}>
            <UserInteractionListener />
            <App />
         </Provider>
      </QueryClientProvider>
   </React.StrictMode>,
   document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
