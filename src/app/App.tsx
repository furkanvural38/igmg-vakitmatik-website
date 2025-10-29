// src/app/App.tsx
import type { ReactNode } from "react";
import { useCity } from "./CityProvider";

import { TopHeader } from "../features/header/TopHeader";
import { PrayerPanel } from "../features/prayer/PrayerPanel";
import { FooterTicker } from "../features/footerTicker/FooterTicker";

function FullscreenBox({
                           children,
                           color = "#fff",
                       }: {
    children: ReactNode;
    color?: string;
}) {
    return (
        <div
            style={{
                width: "100vw",
                height: "100vh",
                backgroundColor: "black",
                color,
                display: "flex",
                flexDirection: "column",
                boxSizing: "border-box",
            }}
            className="bg-black text-white"
        >
            {children}
        </div>
    );
}

function CenterMessage({
                           children,
                           color,
                       }: {
    children: ReactNode;
    color: string;
}) {
    return (
        <div
            style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                padding: "2rem",
                fontSize: "3rem",
                lineHeight: 1.2,
                color,
            }}
            className="flex-1 flex items-center justify-center text-center px-8"
        >
            {children}
        </div>
    );
}

export default function App() {
    const { isValidCity, cityKey, loading, error } = useCity();

    if (!isValidCity) {
        return (
            <FullscreenBox>
                <CenterMessage color="#f33">
                    Unbekannte Stadt: {cityKey}
                </CenterMessage>
            </FullscreenBox>
        );
    }

    if (loading) {
        return (
            <FullscreenBox>
                <CenterMessage color="#ff0">Lädt…</CenterMessage>
            </FullscreenBox>
        );
    }

    if (error) {
        return (
            <FullscreenBox>
                <CenterMessage color="#f33">
                    Fehler beim Laden:
                    <br />
                    {String(error)}
                </CenterMessage>
            </FullscreenBox>
        );
    }

    return (
        <FullscreenBox>
            {/* Header */}
            <header
                style={{
                    padding: "1.5rem 2rem",
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    flexShrink: 0,
                    marginBottom: "10rem",
                }}
                className="w-full px-8 py-6 flex items-start justify-between"
            >
                <TopHeader />
            </header>

            {/* Main */}
            <main
                style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "1rem",
                    gap: "2rem",
                    width: "100%",
                }}
                className="flex-1 flex items-center justify-center gap-8"
            >
                <PrayerPanel />
            </main>

            {/* Footer */}
            <footer
                style={{ padding: "1.5rem 2rem", flexShrink: 0 }}
                className="w-full"
            >
                <FooterTicker />
            </footer>
        </FullscreenBox>
    );
}
