// Assinatura institucional fixa (skill assinatura-rodape). Renderizada uma
// única vez, no shell do App — não duplicar nas telas.
export default function AppSignature() {
  return (
    <footer className="app-signature">
      <p>
        Developed by{" "}
        <a href="https://gileadehub.com.br/" target="_blank" rel="noopener noreferrer">
          Gileade HUB
        </a>
      </p>
    </footer>
  );
}
