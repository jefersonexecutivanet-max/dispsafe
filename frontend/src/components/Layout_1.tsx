import { Link, useLocation, useNavigate } from 'react-router-dom';
export default function Layout({children}:any){
  const loc=useLocation(); const nav=useNavigate(); const is=(p:string)=>loc.pathname.startsWith(p);
  return <div><div className="sidebar">
    <div style={{fontWeight:800,fontSize:20,marginBottom:16,display:'flex',gap:8}}><span style={{background:'#25D366',padding:'4px 8px',borderRadius:8}}>W</span>DispSafe</div>
    <Link className={is('/dashboard')?'active':''} to="/dashboard">Dashboard</Link>
    <Link className={is('/contatos')?'active':''} to="/contatos">Contatos</Link>
    <Link className={is('/campanhas')?'active':''} to="/campanhas">Campanhas</Link>
    <Link className={is('/templates')?'active':''} to="/templates">Templates</Link>
    <Link className={is('/relatorios')?'active':''} to="/relatorios">Relatorios</Link>
    <Link className={is('/configuracoes')?'active':''} to="/configuracoes">Config</Link>
    <div style={{marginTop:'auto'}}><button onClick={()=>{localStorage.clear(); nav('/');}} className="btn btn-outline" style={{width:'100%',color:'#d1d5db'}}>Sair</button></div>
  </div><div className="main"><div className="header"><b>Comunicacao com controle e seguranca</b><span style={{fontSize:12}}>LGPD Ready</span></div><div style={{padding:24}}>{children}</div></div></div>
}
