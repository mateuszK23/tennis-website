export default function Footer() {
  const footer = document.createElement("footer");
  footer.className = "footer";
  footer.innerHTML = `
    <p>Created by <strong>Mateusz Koscielniak</strong></p>
    <p>
      Icon made by <a href="https://www.flaticon.com/authors/freepik" target="_blank">Freepik</a> from
      <a href="https://www.flaticon.com" target="_blank">www.flaticon.com</a>
    </p>
  `;
  return footer;
}
