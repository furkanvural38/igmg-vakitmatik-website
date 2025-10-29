import { useCity } from "../../app/CityProvider";
import IGMGLogo from "../../assets/ressources/igmg-logo.png";

export function TopHeader() {
    const { config } = useCity();

    return (
        <header
            className="
        fixed
        top-4
        left-8
        right-8
        z-50
        flex
        items-center
        justify-between
        px-10
        py-6
        gap-8
        glass-text
        backdrop-blur-xl
        bg-[rgba(10,10,15,0.45)]
        border-b
        border-[rgba(255,255,255,0.12)]
        shadow-[0_10px_40px_rgba(0,0,0,0.6)]
      "
            style={{
                height: "150px",
                boxShadow:
                    "inset 0 0 40px rgba(255,255,255,0.12), 0 30px 80px rgba(0,0,0,0.9)",
            }}
        >
            {/* 🔸 LOGO */}
            <div
                className="flex items-center justify-center"
                style={{ flex: "0 0 300px", height: "100%" }}
            >
                <img
                    src={IGMGLogo}
                    alt="IGMG"
                    className="h-[130px] object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.9)]"
                />
            </div>

            {/* 🔸 MOSCHEE-NAME */}
            <div
                className="
          flex-1
          flex
          items-center
          justify-center
          uppercase
          text-center
          font-bold
          tracking-[.08em]
        "
                style={{
                    fontSize: "5rem",
                    lineHeight: "1.1",
                    color: "#fff",
                    textShadow:
                        "0 2px 4px rgba(0,0,0,0.8), 0 0 10px rgba(0,0,0,0.8)",
                    filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.9))",
                }}
            >
                {config?.mosqueName ?? "—"}
            </div>
        </header>
    );
}
