export function calcularNivel(xp) {
    if (xp >= 100) return "🔥 Lendário";
    if (xp >= 70) return "💪 Hardcore";
    if (xp >= 40) return "🏆 Engajado";
    return "😎 Casual";
  }
  
  export function obterRecompensa(xp) {
    if (xp >= 100) return "🏆 Troféu FURIA Fan do Ano";
    if (xp >= 70) return "📜 Certificado de Fã Lendário";
    if (xp >= 40) return "🎫 Convite VIP Virtual para FanFest";
    return "🖼️ Wallpaper Exclusivo da FURIA";
  }
  