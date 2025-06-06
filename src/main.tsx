
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { store } from "./store/ReduxStore.ts"
import { GoogleOAuthProvider } from "@react-oauth/google";

const queryClient = new QueryClient();
createRoot(document.getElementById('root')!).render(
  
     <Provider store={store}>

     <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
     <QueryClientProvider client={queryClient}>
 
    <App />

    </QueryClientProvider>
    </GoogleOAuthProvider>
    </Provider>
 
)
