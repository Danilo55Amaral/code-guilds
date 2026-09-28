/** @type {import('next').NextConfig} */
const nextConfig = {
  // As chamadas do site para /api/* são repassadas para a API (pasta api/).
  // Assim o navegador só conversa com o domínio do site e o cookie de login
  // funciona sem CORS. A URL da API vem da variável API_URL:
  //   local: API_URL=http://localhost:3333 (no .env.local)
  //   Vercel: API_URL=https://<sua-api>.onrender.com (em Settings → Environment Variables)
  // Sem API_URL, nada é repassado.
  async rewrites() {
    const apiUrl = process.env.API_URL;
    if (!apiUrl) return [];
    return [{ source: "/api/:path*", destination: `${apiUrl}/:path*` }];
  },
};

module.exports = nextConfig;
