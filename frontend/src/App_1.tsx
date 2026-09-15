import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing'; import Login from './pages/Login'; import Register from './pages/Register';
import Dashboard from './pages/Dashboard'; import Contacts from './pages/Contacts'; import Campaigns from './pages/Campaigns';
import Templates from './pages/Templates'; import Reports from './pages/Reports'; import Settings from './pages/Settings';
import Privacy from './pages/Privacy'; import Terms from './pages/Terms'; import Layout from './components/Layout';
function Private({children}:any){ const t=localStorage.getItem('token'); return t?children:<Navigate to="/login"/>; }
export default function App(){ return <BrowserRouter><Routes>
<Route path="/" element={<Landing/>}/><Route path="/login" element={<Login/>}/><Route path="/cadastro" element={<Register/>}/>
<Route path="/privacidade" element={<Privacy/>}/><Route path="/termos" element={<Terms/>}/>
<Route path="/dashboard" element={<Private><Layout><Dashboard/></Layout></Private>}/>
<Route path="/contatos" element={<Private><Layout><Contacts/></Layout></Private>}/>
<Route path="/campanhas" element={<Private><Layout><Campaigns/></Layout></Private>}/>
<Route path="/templates" element={<Private><Layout><Templates/></Layout></Private>}/>
<Route path="/relatorios" element={<Private><Layout><Reports/></Layout></Private>}/>
<Route path="/configuracoes" element={<Private><Layout><Settings/></Layout></Private>}/>
</Routes></BrowserRouter> }
