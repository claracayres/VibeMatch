import { useNavigate } from "react-router-dom";
import { loginWithSpotify } from "../services/auth";

export default function HomeNav() {
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 w-full z-50">
      <div className="mx-auto max-w-7xl px-6 pt-5">
        <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/40 px-6 py-4 backdrop-blur-xl">

          {/* LOGO */}
          <div
            onClick={() => navigate("/")}
            className="cursor-pointer text-xl font-bold text-white"
          >
            Vibe
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Match
            </span>
          </div>

          {/* LINKS */}
          <div className="hidden md:flex items-center gap-8 text-sm text-white/70">
            <a href="#features" className="hover:text-white transition">
              Recursos
            </a>
            <a href="#how" className="hover:text-white transition">
              Como funciona
            </a>
            <a href="#mood" className="hover:text-white transition">
              Mood
            </a>
          </div>

          {/* BOTÃO */}
          <button
            onClick={loginWithSpotify}
            className="rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-5 py-2 text-sm font-semibold text-white shadow-lg transition hover:scale-105"
          >
            Conectar Spotify
          </button>
        </div>
      </div>
    </nav>
  );
}