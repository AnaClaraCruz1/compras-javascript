/*
  Exercício 3 — Página de Pagamento
  Autora: Ana Clara Cruz
  Curso: Técnico em Desenvolvimento de Sistemas — SENAC
*/
const $=id=>document.getElementById(id);
const valor=$("valor"),valorErro=$("valorErro"),pix=$("pix"),cartao=$("cartao"),pixSection=$("pixSection"),cartaoSection=$("cartaoSection");
const cpf=$("cpf"),cpfErro=$("cpfErro"),totalPix=$("totalPix"),numero=$("numeroCartao"),bandeira=$("bandeiraCartao"),cartaoErro=$("cartaoErro");
const titular=$("titular"),titularErro=$("titularErro"),seguranca=$("seguranca"),segurancaErro=$("segurancaErro"),vencimento=$("vencimento"),vencimentoErro=$("vencimentoErro");
const parcelas=$("parcelas"),totalCartao=$("totalCartao"),valorParcela=$("valorParcela"),mensagem=$("mensagem");

function moeda(n){return n.toLocaleString("pt-BR",{style:"currency",currency:"BRL"})}
function valorNumerico(){
  let v=valor.value.replace(/\s|R\$/g,"").trim();
  if(v.includes(","))v=v.replace(/\./g,"").replace(",",".");
  const n=Number(v);return Number.isFinite(n)&&n>0?n:null;
}
function msg(text="",type=""){mensagem.textContent=text;mensagem.className="message"+(type?" "+type:"")}
function atualizarForma(){
  msg();
  pixSection.classList.toggle("hidden",!pix.checked);
  cartaoSection.classList.toggle("hidden",!cartao.checked);
  atualizarTotais();
}
function atualizarTotais(){
  const v=valorNumerico();
  if(v===null){totalPix.textContent="R$ 0,00";totalCartao.textContent="R$ 0,00";valorParcela.textContent="R$ 0,00";return}
  totalPix.textContent=moeda(v*.90);
  const q=Number(parcelas.value),taxa=q===4?.05:q===5?.10:0,total=v*(1+taxa);
  totalCartao.textContent=moeda(total);valorParcela.textContent=moeda(total/q);
}
function validarValor(){
  if(valorNumerico()===null){valorErro.textContent="Informe um valor válido para a compra.";valor.focus();return false}
  valorErro.textContent="";return true;
}
$("btnInformar").addEventListener("click",()=>{
  msg();if(!validarValor())return;atualizarTotais();msg("Dados liberados. Preencha os campos para continuar.","success");
});
pix.addEventListener("change",atualizarForma);cartao.addEventListener("change",atualizarForma);valor.addEventListener("input",atualizarTotais);parcelas.addEventListener("change",atualizarTotais);

cpf.addEventListener("input",()=>{let v=cpf.value.replace(/\D/g,"").slice(0,11);if(v.length>9)v=v.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/,"$1.$2.$3-$4");else if(v.length>6)v=v.replace(/(\d{3})(\d{3})(\d{1,3})/,"$1.$2.$3");else if(v.length>3)v=v.replace(/(\d{3})(\d{1,3})/,"$1.$2");cpf.value=v});
numero.addEventListener("input",()=>{numero.value=numero.value.replace(/\D/g,"").slice(0,16).replace(/(\d{4})(?=\d)/g,"$1 ");mostrarBandeira()});
function svgData(svg){return"data:image/svg+xml;charset=UTF-8,"+encodeURIComponent(svg)}
const b1234='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 52"><rect width="80" height="52" rx="6" fill="#143d8d"/><circle cx="31" cy="26" r="12" fill="#fff"/><circle cx="49" cy="26" r="12" fill="#f2c94c"/></svg>';
const b4321='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 52"><rect width="80" height="52" rx="6" fill="#111"/><rect x="7" y="8" width="66" height="36" rx="4" fill="#e9ecef"/><text x="40" y="31" text-anchor="middle" font-size="13" font-family="Arial" font-weight="700">4321</text></svg>';
function mostrarBandeira(){
  const n=numero.value.replace(/\D/g,"");bandeira.classList.add("hidden");bandeira.removeAttribute("src");
  if(n.startsWith("1234")){bandeira.src=svgData(b1234);bandeira.alt="Bandeira 1234";bandeira.classList.remove("hidden")}
  else if(n.startsWith("4321")){bandeira.src=svgData(b4321);bandeira.alt="Bandeira 4321";bandeira.classList.remove("hidden")}
}
seguranca.addEventListener("input",()=>seguranca.value=seguranca.value.replace(/\D/g,"").slice(0,4));
vencimento.addEventListener("input",()=>{let v=vencimento.value.replace(/\D/g,"").slice(0,4);if(v.length>2)v=v.replace(/(\d{2})(\d{1,2})/,"$1/$2");vencimento.value=v});

function validarPix(){
  const n=cpf.value.replace(/\D/g,"");cpfErro.textContent=n.length===11?"":"Informe um CPF válido com 11 dígitos.";return n.length===11;
}
function validarCartao(){
  let ok=true,n=numero.value.replace(/\D/g,"");cartaoErro.textContent="";titularErro.textContent="";segurancaErro.textContent="";vencimentoErro.textContent="";
  if(n.length!==16)cartaoErro.textContent="Informe os 16 números do cartão.",ok=false;
  else if(!n.startsWith("1234")&&!n.startsWith("4321"))cartaoErro.textContent="Número de cartão inválido.",ok=false;
  if(titular.value.trim().length<3)titularErro.textContent="Informe o nome do titular.",ok=false;
  if(seguranca.value.length<3)segurancaErro.textContent="Informe o código de segurança.",ok=false;
  const m=vencimento.value.match(/^(\d{2})\/(\d{2})$/);
  if(!m)vencimentoErro.textContent="Informe a validade no formato MM/AA.",ok=false;
  else if(Number(m[1])<1||Number(m[1])>12)vencimentoErro.textContent="Informe um mês válido.",ok=false;
  return ok;
}
$("paymentForm").addEventListener("submit",e=>{
  e.preventDefault();msg();if(!validarValor())return;
  const ok=pix.checked?validarPix():validarCartao();
  if(!ok){msg("Confira os dados informados antes de pagar.","error");return}
  msg("Pagamento realizado com sucesso!","success");
});
atualizarForma();atualizarTotais();