import { Link, useLocation, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../services/firebase';
export default function Layout({children}:any){
  const loc=useLocation(); const nav=useNavigate(); const is=(p:string)=>loc.pathname.startsWith(p);
  return <div><div className="sidebar">
    <div className="brand"><span className="brand-mark">DS</span>DispSafe</div>
    <Link className={is('/dashboard')?'active':''} to="/dashboard">Dashboard</Link>
    <Link className={is('/contatos')?'active':''} to="/contatos">Contatos</Link>
    <Link className={is('/campanhas')?'active':''} to="/campanhas">Campanhas</Link>
    <Link className={is('/templates')?'active':''} to="/templates">Templates</Link>
    <Link className={is('/relatorios')?'active':''} to="/relatorios">Relatórios</Link>
    <Link className={is('/configuracoes')?'active':''} to="/configuracoes">Configurações</Link>
    <div style={{marginTop:'auto'}}><button onClick={async ()=>{await signOut(auth); localStorage.clear(); nav('/');}} className="btn btn-outline" style={{width:'100%',color:'#d1d5db'}}>Sair</button></div>
  </div><div className="main"><div className="header"><b>Visão geral da operação</b><span>LGPD READY</span></div><div style={{padding:32}}>{children}</div></div></div>
}
