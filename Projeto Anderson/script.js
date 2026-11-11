// ===== CONFIGURAÇÃO =====
// Número do WhatsApp do personal: código do país + DDD + número, só dígitos.
const WHATSAPP = "5521967694356";
// ========================

const form = document.getElementById("anamnese");
const erro = document.getElementById("erro");

function formatarData(iso) {
  if (!iso) return "";
  const [a, m, d] = iso.split("-");
  return `${d}/${m}/${a}`;
}

function valorDoCampo(campo) {
  // Grupo de opções (radio ou checkbox)
  const marcados = [...campo.querySelectorAll("input[type=radio]:checked, input[type=checkbox]:checked")];
  if (campo.querySelector("input[type=radio], input[type=checkbox]")) {
    return marcados.map(i => i.value).join(", ");
  }
  // Campo de texto, data, número ou textarea
  const entrada = campo.querySelector("input, textarea");
  if (!entrada) return "";
  return entrada.type === "date" ? formatarData(entrada.value) : entrada.value.trim();
}

function montarMensagem() {
  let msg = "*FORMULÁRIO DE ANAMNESE*\n";
  form.querySelectorAll("fieldset").forEach(bloco => {
    msg += `\n*${bloco.querySelector("legend").textContent.toUpperCase()}*\n`;
    bloco.querySelectorAll(".campo").forEach(campo => {
      const rotulo = campo.querySelector("label, .rotulo");
      // Em campos de texto, o primeiro label é o título; em grupos, é o .rotulo
      const titulo = campo.querySelector(".rotulo") || campo.querySelector(":scope > label");
      const resposta = valorDoCampo(campo) || "Não informado";
      if (titulo) msg += `${titulo.textContent.trim()} ${resposta}\n`;
    });
  });
  return msg;
}

form.addEventListener("submit", evento => {
  evento.preventDefault();
  erro.textContent = "";

  if (!form.checkValidity()) {
    form.reportValidity();
    erro.textContent = "Preencha os campos obrigatórios para enviar.";
    return;
  }

  const url = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(montarMensagem())}`;
  window.open(url, "_blank", "noopener");
});